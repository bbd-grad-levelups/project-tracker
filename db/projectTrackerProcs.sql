CREATE PROCEDURE CreateProject
    @ProjectName VARCHAR(255),
    @AccessUser VARCHAR(255),
    @AccessKey VARCHAR(255),
    @Jira VARCHAR(255),
    @Git VARCHAR(255),
    @Conf VARCHAR(255),
    @User VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ProjectID TABLE (ID INT);

    BEGIN TRY

        BEGIN TRANSACTION;

        INSERT INTO project (project_name, access_user, access_key, jira_link, git_link, confluence_link)
        OUTPUT inserted.project_id INTO @ProjectID
        VALUES (@ProjectName, @AccessUser, @AccessKey, @Jira, @Git, @Conf);

        DECLARE @InsertedProjectID INT;
        SELECT @InsertedProjectID = ID FROM @ProjectID;
        
        
        INSERT INTO user_project (project_id, role_id, user_id)
        VALUES (
          @InsertedProjectID,
          (SELECT role_id FROM [role] WHERE [description] = 'Owner'),
          (SELECT user_id FROM [user] WHERE [uid] = @User)
        )

        COMMIT TRANSACTION;

        RETURN 0;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;
    END CATCH;
END;
GO

CREATE PROCEDURE RemoveProject
    @ProjectName VARCHAR(255),
    @User VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        BEGIN TRANSACTION;

        DECLARE @ProjectID INT;
        SELECT @ProjectID = p.project_id
        FROM [user] u
        JOIN user_project up ON u.user_id = up.user_id
        JOIN project p ON up.project_id = p.project_id
        WHERE up.role_id = (SELECT role_id FROM [role] WHERE [description] = 'Owner')
        AND p.project_name = @ProjectName
        AND u.uid = @User

        DELETE FROM board WHERE project_id = @ProjectID
        DELETE FROM project WHERE project_id = @ProjectID
        DELETE FROM user_project WHERE project_id = @ProjectID
        

        COMMIT TRANSACTION;

        RETURN 0;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;
    END CATCH;
END;
GO