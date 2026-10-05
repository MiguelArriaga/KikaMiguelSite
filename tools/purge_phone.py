import subprocess
import tempfile
from getpass import getpass
from pathlib import Path


FILTER_REPO = Path(
    r"C:\Users\migue\anaconda3\Scripts\git-filter-repo.exe"
)


def git(*args, capture=False, check=True):
    return subprocess.run(
        ["git", *args],
        text=True,
        capture_output=capture,
        check=check,
    )


def main():
    # Make sure we're inside a Git repository.
    result = git(
        "rev-parse",
        "--is-inside-work-tree",
        capture=True,
        check=False,
    )

    if result.returncode != 0:
        raise SystemExit("ERROR: Run this from inside the Git repository.")

    # Don't rewrite history with uncommitted changes.
    status = git("status", "--porcelain", capture=True).stdout

    if status.strip():
        raise SystemExit(
            "ERROR: Working tree is not clean.\n"
            "Commit or stash your changes first."
        )

    if not FILTER_REPO.exists():
        raise SystemExit(
            f"ERROR: git-filter-repo not found:\n{FILTER_REPO}"
        )

    # Remember origin because git-filter-repo removes it.
    result = git(
        "remote",
        "get-url",
        "origin",
        capture=True,
        check=False,
    )

    origin = result.stdout.strip() if result.returncode == 0 else None

    print("Enter the exact phone-number variant to remove.")
    print("Your input will be hidden.")

    phone = getpass("Phone: ")

    if not phone:
        raise SystemExit("No phone number entered.")

    confirmation = input(
        "\nThis will rewrite the entire Git history.\n"
        "Type PURGE to continue: "
    )

    if confirmation != "PURGE":
        raise SystemExit("Cancelled.")

    replacement_path = None

    try:
        # Store the replacement rule outside the repository.
        with tempfile.NamedTemporaryFile(
            mode="w",
            encoding="utf-8",
            delete=False,
            suffix=".txt",
        ) as f:
            replacement_path = Path(f.name)
            f.write(f"{phone}==>REMOVED\n")

        print("\nRewriting history...")

        subprocess.run(
            [
                str(FILTER_REPO),
                "--replace-text",
                str(replacement_path),
                "--force",
            ],
            check=True,
        )

        print("\nChecking rewritten history...")

        result = git(
            "log",
            "--all",
            f"-S{phone}",
            "--oneline",
            capture=True,
        )

        if result.stdout.strip():
            print("\nWARNING: Phone number is still present.")
            print("DO NOT PUSH.")
            return

        print("Phone number not found in rewritten history.")

        # git-filter-repo normally removes origin.
        if origin:
            result = git(
                "remote",
                "get-url",
                "origin",
                capture=True,
                check=False,
            )

            if result.returncode != 0:
                git("remote", "add", "origin", origin)
                print("Restored Git remote 'origin'.")

        print("\nPURGE COMPLETE.")
        print("\nWhen ready, publish the rewritten history with:")
        print("    git push --force origin master")

    finally:
        if replacement_path and replacement_path.exists():
            replacement_path.unlink()


if __name__ == "__main__":
    main()
