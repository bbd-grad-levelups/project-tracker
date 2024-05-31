import "./create-project.css";
import { Container, Stack, Typography, TextField } from "@mui/material";
import Button from "@mui/material/Button";

function CreateProject() {
    return (
        <div className="create-project">
            <Container maxWidth="md" sx={{ mt: 3, mb: 3 }}>
                <Stack spacing={3} alignItems="flex-start" component="form" action="/create" method="POST" >
                    <Typography variant="h2">Create a new project</Typography>
                    <TextField
                        inputProps={{ maxLength: 255 }}
                        required
                        id="project-name"
                        label="Project Name"
                        inputMode="text"
                        fullWidth={true}
                    />
                    <TextField
                        inputProps={{ maxLength: 5 }}
                        required
                        id="project-code"
                        label="Project Code"
                        inputMode="text"
                        fullWidth={true}
                    />
                    <TextField
                        inputProps={{ maxLength: 255 }}
                        required
                        id="jira-link"
                        label="Jira Link"
                        inputMode="url"
                        fullWidth={true}
                    />
                    <TextField
                        inputProps={{ maxLength: 255 }}
                        id="confluence-link"
                        label="Confluence Link"
                        inputMode="url"
                        fullWidth={true}
                    />
                    <TextField
                        inputProps={{ maxLength: 255 }}
                        id="github-link"
                        label="Github Link"
                        inputMode="url"
                        fullWidth={true}
                    />
                    <Button variant="contained" color="primary" type="submit" size="large">
                        Create
                    </Button>
                </Stack>
            </Container>
        </div>
    );
}

export default CreateProject;
