# MindMate Database Schema

## Entities

### User (Abstract Base Class)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | Long | PK, Auto Inc | Unique identifier |
| `email` | String | Unique, Not Null | User login email |
| `password` | String | Not Null | Hashed password |
| `first_name` | String | | First name |
| `last_name` | String | | Last name |
| `role` | Enum | | `STUDENT`, `ADVISOR`, `ADMIN` |

### Student (Extends User)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `student_id` | String | | University Student ID |
| `department` | String | | Academic Department |

### Advisor (Extends User)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `specialization`| String | | e.g. "Psychology" |
| `office_hours` | String | | Availability |

### Task
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | Long | PK | |
| `student_id` | Long | FK -> Student | Owner of the task |
| `title` | String | | Task title |
| `description` | String | | |
| `due_date` | Date | | |
| `status` | Enum | | `TODO`, `IN_PROGRESS`, `DONE` |
| `priority` | Enum | | `LOW`, `MEDIUM`, `HIGH` |

### JournalEntry
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | Long | PK | |
| `student_id` | Long | FK -> Student | Owner |
| `title` | String | | |
| `content` | Text | Length: 5000 | Journal body |
| `mood_tag` | String | | Mood associated with entry |
| `created_at` | DateTime | | |

### MoodEntry
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | Long | PK | |
| `student_id` | Long | FK -> Student | Owner |
| `mood_score` | Int | | 1-10 scale (or similar) |
| `mood_label` | String | | e.g. "Happy", "Sad" |
| `note` | String | | Optional short note |
| `timestamp` | DateTime | | Time of recording |

### Relationships
*   **One-to-Many**: `Student` -> `Task`
*   **One-to-Many**: `Student` -> `JournalEntry`
*   **One-to-Many**: `Student` -> `MoodEntry`
