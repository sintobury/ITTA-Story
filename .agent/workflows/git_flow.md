---
description: Git Feature Branch Workflow
---

When the user requests changes that require a new feature or significant refactor, follow this workflow:

1.  **Create Branch**: 
    ```powershell
    git checkout -b feature/[name]
    ```
2.  **Implement Changes**: Perform coding tasks.
3.  **Commit**: 
    ```powershell
    git add .
    git commit -m "[Type]: [Description] (Korean)"
    ```
4.  **Push Feature Branch**: 
    ```powershell
    git push origin feature/[name]
    ```
5.  **Merge to Master**:
    ```powershell
    git checkout master
    git merge feature/[name]
    ```
6.  **Push Master**:
    ```powershell
    git push origin master
    ```
