import type { NextPage } from 'next'
import {styled, ThemeProvider} from "@mui/material/styles"
import theme from "../theme/theme";
import {
    Box, BoxProps,
    Card,
    CardContent,
    Container, Divider,
    Grid,
    Typography, TypographyProps
} from "@mui/material";
import {QueryClient, QueryClientProvider, useQuery} from "@tanstack/react-query";
import axios from "axios";
import {useRouter} from "next/router";

type EventCardProps = {
    name: string,
    interest: string,
    time: Date,
    location: string
}

type Event = {
    event_id: string,
    event_name: string,
    event_start_time: string,
    event_creation_date: Date,
    event_duration: number,
    type_id: number
}

const PrimaryText = styled(Typography)<TypographyProps>(({theme}) => ({
    color: theme.palette.primary.main
}))

const EventCard = ({name, interest, time, location}: EventCardProps) => {
    return (
        <Card sx={{minWidth: 100}}>
            <CardContent>
                <Typography>
                    <PrimaryText>{name}</PrimaryText>
                     is interested in
                    <PrimaryText>{interest}</PrimaryText>
                    at
                </Typography>
            </CardContent>
        </Card>
    )
}

const queryClient = new QueryClient();

const SectionText = styled(Typography)<TypographyProps>(({theme}) => ({
    color: theme.palette.secondary.main,
    variant: "h1",
    component: "h1"
}));

const SectionContainer =styled(Box)<BoxProps>(({theme}) => ({
    "paddingBottom": 10,
    "minHeight": "40vh"
}));

const HomePage = () => {

    const router = useRouter();
    const {id} = router.query;

    const {data: events} = useQuery(["events"], () => axios.get('/api/booking').then<Event[]>(res => res.data.rest))

    return (
        <Container>
            <Typography>{id}</Typography>
            <Box sx={{width: "100%"}}>
                <Typography variant={"h6"} component={"h6"} sx={{width: "100%", fontSize: 48}}>
                    Sup Bot
                </Typography>
            </Box>
            <SectionContainer>
                <SectionText>Join In On Someone Else!</SectionText>
                <Grid container spacing={2}>
                    {
                        events && events.map(({event_id, event_name, event_start_time, event_duration}) =>
                            <Grid item key={event_id} >
                                <EventCard name={event_name} interest={"no"} time={new Date(event_start_time)} location={"not implemented"}/>
                            </Grid>)
                    }
                </Grid>
            </SectionContainer>
            <Divider/>
            <SectionContainer>
                <SectionText>Interests That You Are Following</SectionText>
            </SectionContainer>
        </Container>
    )
}

const Home: NextPage = () => {

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <HomePage/>
            </ThemeProvider>
        </QueryClientProvider>
    )
}

export default Home
