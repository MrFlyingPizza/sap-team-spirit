import type { NextPage } from 'next'
import {ThemeProvider} from "@mui/material/styles"
import theme from "../theme/theme";
import {Container, Grid, Skeleton, Typography} from "@mui/material";

const Home: NextPage = () => {
  return (
      <ThemeProvider theme={theme}>
          <Container>
              <Typography variant={"h6"} >
                  Team Spirit
              </Typography>
              <Grid container>
                  {
                      Array(10).map((_, i) =>
                          <Grid item key={i}>
                              <Skeleton variant={"rectangular"} width={200} height={500}/>
                          </Grid>)
                  }
              </Grid>
          </Container>
      </ThemeProvider>
  )
}

export default Home
