import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';

function Home() {
    return (
        <div>
            <h1>Start a new journey</h1>
            <Button variant="contained" component={NavLink} to="/journey">
                Start Journey
            </Button>
        </div>
    );
}

export default Home;
