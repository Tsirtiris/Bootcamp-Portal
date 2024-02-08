-- Active: 1702319198104@@127.0.0.1@3306

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        last_name TEXT DEFAULT '',
        city TEXT DEFAULT '',
        work_experience TEXT DEFAULT '',
        education TEXT DEFAULT '',
        profile_photo TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        bio TEXT DEFAULT ''
    );

CREATE TABLE
    jobs (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        company TEXT NOT NULL,
        bootcamp TEXT NOT NULL,
        company_description TEXT NOT NULL,
        bootcamp_description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    applications (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        user_id TEXT NOT NULL,
        job_id TEXT NOT NULL,
        cv TEXT NOT NULL,
        status TEXT DEFAULT 'waiting',
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (job_id) REFERENCES jobs (id) ON UPDATE CASCADE ON DELETE CASCADE
    );
