from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class Language(str, Enum):
    python     = "python"
    javascript = "javascript"
    typescript = "typescript"
    java       = "java"
    cpp        = "cpp"
    c          = "c"
    go         = "go"
    rust       = "rust"
    php        = "php"
    ruby       = "ruby"

class Severity(str, Enum):
    critical = "critical"
    warning  = "warning"
    info     = "info"

class ReviewRequest(BaseModel):
    title:        str      = Field(..., min_length=3, max_length=200)
    language:     Language
    code_snippet: str      = Field(..., min_length=10, max_length=50000)

class IssueOut(BaseModel):
    id:          str
    severity:    Severity
    category:    str
    line_number: Optional[int]
    title:       str
    description: str
    suggestion:  Optional[str]

class ReviewOut(BaseModel):
    id:             str
    title:          str
    language:       str
    code_snippet:   str
    ai_summary:     Optional[str]
    total_issues:   int
    critical_count: int
    warning_count:  int
    info_count:     int
    score:          int
    status:         str
    issues:         List[IssueOut] = []
    created_at:     datetime