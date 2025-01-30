import {Card, CardActionArea, CardContent, CardMedia, Container, Grid2, Typography} from "@mui/material";
import Image from "next/image";
import airspaceExplorer from "@/public/img/airspace-explorer.png";
import activeConsolidations from "@/public/img/active-consolidations.png";
import Link from "next/link";


export default function Home() {
  return (
    <Container maxWidth="md" sx={{ mt: 10,}}>
      <Grid2 container spacing={4} columns={2}>
        <Grid2 size={{ xs: 2, md: 1, }}>
          <Link href="/active-consolidations" style={{color: 'inherit', textDecoration: 'none',}}>
            <Card>
              <CardActionArea>
                <CardMedia title="Active Radar Consolidations">
                  <div style={{position: 'relative', width: '100%', height: 200,}}>
                    <Image src={activeConsolidations} alt="Active Radar Consolidations" layout="fill"
                           objectFit="cover"/>
                  </div>
                </CardMedia>
                <CardContent>
                  <Typography variant="h5" gutterBottom>Active Radar Consolidations</Typography>
                  <Typography>See the current radar splits vZDC is using. Accuracy is not guarenteed.</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        </Grid2>
        <Grid2 size={{ xs: 2, md: 1, }}>
          <Link href="/explorer" style={{color: 'inherit', textDecoration: 'none',}}>
            <Card>
              <CardActionArea>
                <CardMedia title="Active Radar Consolidations">
                  <div style={{position: 'relative', width: '100%', height: 200,}}>
                    <Image src={airspaceExplorer} alt="Airspace Explorer" layout="fill" objectFit="cover"/>
                  </div>
                </CardMedia>
                <CardContent>
                  <Typography variant="h5" gutterBottom>Airspace Explorer</Typography>
                  <Typography>Get to know your facility better by visualizing the airspace encompassed by
                    vZDC.</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        </Grid2>
      </Grid2>
      </Container>
  );
}
