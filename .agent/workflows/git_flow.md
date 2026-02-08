---
description: Git Feature Branch Workflow (Korean & Strict Cleanup)
---

Follow this strict workflow for all code changes.

1.  **Create Branch**:
    ```powershell
    // turbo
    git checkout -b feature/[name]
    ```

2.  **Implement Changes**: Perform necessary code edits.

3.  **Commit (Korean Required)**:
    -   **Rule**: Commit messages **MUST** be in Korean.
    -   Format: `[Type]: [Description] (Korean)`
    ```powershell
    // turbo
    git add .
    git commit -m "타입: 설명 (예: 리팩토링: 버튼 컴포넌트 분리)"
    ```

4.  **Push Feature Branch**:
    ```powershell
    // turbo
    git push origin feature/[name]
    ```

5.  **Merge into Master**:
    ```powershell
    // turbo
    git checkout master
    // turbo
    git merge feature/[name]
    ```

6.  **Push Master**:
    ```powershell
    // turbo
    git push origin master
    ```

7.  **Delete Feature Branch (Mandatory)**:
    -   Clean up the local branch after successful merge.
    ```powershell
    // turbo
    git branch -d feature/[name]
    ```

8.  **Delete Remote Feature Branch (Optional/Recommended)**:
    -   To keep the repository clean, remove the branch from GitHub as well.
    ```powershell
    // turbo
    git push origin --delete feature/[name]
    ```
