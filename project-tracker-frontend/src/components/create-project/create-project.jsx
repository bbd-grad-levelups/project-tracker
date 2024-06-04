import "./create-project.css";
import { Container, Stack, Typography, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import React, { useState } from "react";

function CreateProject() {

    const token = sessionStorage.getItem("idToken")
    const [formData, setFormData] = useState({
        projectName: '',
        projectAbbreviation: '',
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
                    'Authorization': 'Bearer ' + token
                },
            });
            const data = await response.json();
            console.log('Success:', data);
            location.href = window.location.protocol + "//" + window.location.host
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
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
                        inputProps={{ maxLength: 8 }}
                        required
                        name="projectAbbreviation"
                        label="Project Abbreviation"
                        inputMode="text"
                        type="text"
                        fullWidth={true}
                        value={formData.projectAbbreviation}
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
                        inputProps={{ maxLength: 255 }}
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
                        inputProps={{ maxLength: 255 }}
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
                        type="url"
                        value={formData.githubLink}
                        onChange={handleChange}
                    />
                    <Button variant="contained" color="primary" type="submit" size="large">
                        Create
                    </Button>
                </Stack>
            </Container>
    );
}

export default CreateProject;
