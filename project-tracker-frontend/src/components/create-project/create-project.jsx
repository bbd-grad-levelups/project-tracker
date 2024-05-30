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
                        required
                        id="jira-link"
                        label="Jira Link"
                        fullWidth={true}
                    />
                    <TextField
                        id="confluence-link"
                        label="Confluence Link"
                        fullWidth={true}
                    />
                    <TextField
                        id="github-link"
                        label="Github Link"
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
