// @flow
import type {Node} from 'react';

import React from 'react';
import {Box, CenteredLanding, Grid, GridItem, Image, NavigationList,NavigationListItem, Text, Typography, Wrapper} from 'dcme-style';
import IndexMarkdown from 'pages/index.md';
import PageLayout from 'component/PageLayout';
import API from 'content/API';
import IconParcel from 'content/icon-parcelinverted0001.png';

export default () => <Box>
    <Box modifier="invertedCopy invertedBackground">
        <Wrapper>
            <CenteredLanding
                modifier="heightHalf"
                top={() => <Text element="h1" modifier="sizeTera superDuper">dataparcels</Text>}
                bottom={() => <Grid>
                    <GridItem modifier="8 padding">
                        <Text element="p" modifier="monospace margin">A library for editing data structures that works really well with React.</Text>
                        <Text element="p" modifier="monospace"><a className="Link" href="https://github.com/blueflag/dataparcels">github</a></Text>
                    </GridItem>
                    <GridItem modifier="4 padding">
                        <Image modifier="center logo" src={IconParcel} />
                    </GridItem>
                </Grid>}
            />
        </Wrapper>
    </Box>
    <Box modifier="paddingTopKilo">
        <Wrapper modifier="marginBottom">
            <PageLayout
                content={() => <Box>
                    <Typography>
                        <IndexMarkdown />
                    </Typography>
                </Box>}
                nav={() => <NavigationList>
                    <NavigationListItem><a className="Link" href={`#What-is-it`}>What is it?</a></NavigationListItem>
                    <NavigationListItem><a className="Link" href={`#Getting-Started`}>Getting Started</a></NavigationListItem>
                    <NavigationListItem><a className="Link" href={`#Examples`}>Examples</a></NavigationListItem>
                    <NavigationListItem><a className="Link" href={`#API`}>API</a></NavigationListItem>
                </NavigationList>}
            />
            <Text id="API" element="h2" modifier="sizeMega">API</Text>
            <API />
        </Wrapper>
    </Box>
</Box>