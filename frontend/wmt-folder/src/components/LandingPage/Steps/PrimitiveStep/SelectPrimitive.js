import React, {useState, useEffect, useContext} from "react";
import { SelectedPrimitive } from "../../../../contexts/SelectedPrimitive";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import "../StepStyle.scss";   
import LoginService from "../../../../services/LoginService";
import LoadingLinearIndicator from "../../../../Utils/LoadingLinearIndicator";


export default function SelectLang() {
    const [primitives, setPrimitives] = useState([]);
    const [loading, setLoading] = useState(true);

    const [checked, setChecked] = useState([0]);

    const { selectedPrimitive, setSelectedPrimitive, controlPrimitive, setControlPrimitive } = useContext(SelectedPrimitive);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [checked];

        if (currentIndex === -1 && value.id !== selectedPrimitive.id) {
            newChecked.push(value);
            setSelectedPrimitive(newChecked.at(1));
            setControlPrimitive(0);
        } else {
            newChecked.splice(currentIndex, 1);
            setSelectedPrimitive("");
        }

        setChecked(newChecked);
    };

    function printPrimitives(){
        return primitives.map( primitive => {
            const labelId = `checkbox-list-label-${primitive}`;
            console.log("primitive", primitive, "and selected primitive ", selectedPrimitive);

            return(
                <Box key={primitive.id}>
                    <ListItem>
                        <ListItemButton role={undefined} onClick={handleToggle(primitive)} dense>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={checked.indexOf(primitive) !== -1 || primitive.id === selectedPrimitive.id}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary={primitive.label}
                                secondary={primitive.description}
                            />
                        </ListItemButton>
                    </ListItem>
                    {primitives.indexOf(primitive) !== (primitives.length-1) ? <Divider component="li" /> : null}
                </Box>
            )
        })
    }

    

    useEffect(() => {
        async function fetchData() {
            const response = await LoginService.getPrimitives();
            setPrimitives(response);
            setLoading(false);
        }

        fetchData();        
    }, []);

    return (
        <Box className="container">
            <Paper className="primitives" elevation={8} sx={{width: '40vw'}}>
                <Typography sx={{ mt: 2, mb: 2 }} variant="h6" component="div">   
                    Protection techniques list
                </Typography>
                { loading ? (
                    <LoadingLinearIndicator />
                ) : (
                    <List>
                        { printPrimitives() }
                    </List>
                )}
            </Paper>
            {
                controlPrimitive === 1 ?
                <Typography sx={{ color:"red" }} variant="h6" component="div">   
                    You have to choose one to continue
                </Typography> : null
            }
        </Box>
    );
}