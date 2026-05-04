import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';

function Home() {
    // the home page is page that can be skipped - in the future it could be used to show previous journeys, or to show a welcome message, or to show some tips for the user
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
