import "./create-project.css";
import { Container, Stack, Typography, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import React, { useState } from "react";

function CreateProject() {

    const [formData, setFormData] = useState({
        projectName: '',
        projectCode: '',
        projectDescription: '',
        accessUser: '',
        accessKey: '',
        jiraLink: '',
        confluenceLink: '',
        githubLink: '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const sendProjectData = async (event) => {
        event.preventDefault();

        const params = new URLSearchParams();
        Object.entries(formData).forEach(([key, value]) => {
            params.append(key, value);
        });

        console.log(params.toString());

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/project/create?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + 'testToken'
                },
            });
            const data = await response.json();
            console.log('Success:', data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="create-project">
            {/* component="form" action="/create" method="POST" */}
            <Container maxWidth="md" sx={{ mt: 3, mb: 3 }}>
                <Stack spacing={3} alignItems="flex-start" component="form" id="create-project-form" onSubmit={sendProjectData} >
                    <Typography variant="h2">Create a new project</Typography>
                    <TextField
                        inputProps={{ maxLength: 255 }}
                        required
                        name="projectName"
                        label="Project Name"
                        inputMode="text"
                        type="text"
                        fullWidth={true}
                        value={formData.projectName}
                        onChange={handleChange}
                    />
                    <TextField
                        inputProps={{ maxLength: 5 }}
                        required
                        name="projectCode"
                        label="Project Code"
                        inputMode="text"
                        type="text"
                        fullWidth={true}
                        value={formData.projectCode}
                        onChange={handleChange}
                    />
                    <TextField
                        inputProps={{ maxLength: 255 }}
                        required
                        name="projectDescription"
                        label="Project Description"
                        inputMode="text"
                        type="text"
                        multiline
                        rows={4}
                        fullWidth={true}
                        value={formData.projectDescription}
                        onChange={handleChange}
                    />
                    <TextField
                        inputProps={{ maxLength: 5 }}
                        required
                        name="accessUser"
                        label="Access User"
                        helperText="Your Jira user"
                        inputMode="text"
                        type="text"
                        fullWidth={true}
                        value={formData.accessUser}
                        onChange={handleChange}
                    />
                    <TextField
                        inputProps={{ maxLength: 5 }}
                        required
                        name="accessKey"
                        label="Access Key"
                        helperText="Your users' Jira access key"
                        inputMode="text"
                        fullWidth={true}
                        type="text"
                        value={formData.accessKey}
                        onChange={handleChange}
                    />
                    <TextField
                        inputProps={{ maxLength: 255 }}
                        required
                        name="jiraLink"
                        label="Jira Link"
                        inputMode="url"
                        type="url"
                        fullWidth={true}
                        value={formData.jiraLink}
                        onChange={handleChange}
                    />
                    <TextField
                        inputProps={{ maxLength: 255 }}
                        name="confluenceLink"
                        label="Confluence Link"
                        inputMode="url"
                        fullWidth={true}
                        required
                        type="url"
                        value={formData.confluenceLink}
                        onChange={handleChange}
                    />
                    <TextField
                        inputProps={{ maxLength: 255 }}
                        name="githubLink"
                        label="Github Link"
                        inputMode="url"
                        fullWidth={true}
                        required
                        type="url"
                        value={formData.githubLink}
                        onChange={handleChange}
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
