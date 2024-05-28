CREATE TABLE [user] (
    [user_id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [uid] VARCHAR(255) NOT NULL,
	username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);
GO

CREATE TABLE [role] (
	role_id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[description] VARCHAR(128) NOT NULL UNIQUE
);
GO

CREATE TABLE project (
	project_id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	project_name VARCHAR(255) NOT NULL,
	access_user VARCHAR(255) NOT NULL,
	access_key VARCHAR(255) NOT NULL,
	jira_link VARCHAR(255) NOT NULL UNIQUE,
	git_link VARCHAR(255) UNIQUE,
	confluence_link VARCHAR(255) UNIQUE
);
GO

CREATE TABLE user_project (
    user_project_id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    project_id INT NOT NULL,
	[user_id] INT NOT NULL,
    role_id INT NOT NULL,
	CONSTRAINT fk_up_project FOREIGN KEY (project_id) REFERENCES project(project_id),
	CONSTRAINT fk_up_user FOREIGN KEY ([user_id]) REFERENCES [user]([user_id]),
	CONSTRAINT fk_up_role FOREIGN KEY (role_id) REFERENCES [role](role_id)
);
GO

CREATE UNIQUE INDEX uix_user_project ON user_project (project_id, [user_id], role_id);
GO

CREATE TABLE board (
    board_id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    project_id INT NOT NULL,
	board_name VARCHAR(255) NOT NULL,
    board_key VARCHAR(255) NOT NULL,
	CONSTRAINT fk_board_project FOREIGN KEY (project_id) REFERENCES project(project_id)
);
GO