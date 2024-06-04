import './unselected-container.css'
import { Typography, Container } from '@mui/material'

function UnselectedContainer() {
    return (
        <Container maxWidth="md" sx={{ mt: 3, mb: 3 }}>
            <Typography variant="h2">Select or create a new project</Typography>
        </Container>
    )
}

export default UnselectedContainer