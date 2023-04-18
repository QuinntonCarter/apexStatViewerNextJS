import React, { useState } from "react";
import { Box, Container, Flex } from "@chakra-ui/react";
import axios from "axios";
import Header from "./Header.js";
import Search from "./Search.js";
import StatsViewer from "./StatsViewer.js";
import menuStyles from "../styles/Menu.module.css";

const apexAPI = axios.create({
  baseURL: process.env.APEXAPIURL,
});

function Layout(props) {
  const [platform, setPlatform] = useState(false);
  const [player, setPlayer] = useState(null);

  const [hoveredLegend, setHoveredLegend] = useState([]);
  const [selectedLegend, setSelectedLegend] = useState([]);

  const [foundStats, setFoundStats] = useState({});
  const [error, setError] = useState([]);
  const [playerLegendData, setPlayerLegendData] = useState([]);

  const [loading, setLoading] = useState(false);

  function searchUser(e) {
    e.preventDefault();
    apexAPI({
      method: "GET",
      params: {
        platform: platform,
        player: player,
        auth: process.env.APEXAPIACCESS,
      },
    })
      .then((res) => {
        if (res.data.Error) {
          showError(res.data.Error);
        } else {
          setFoundStats(
            {
              // ** assign this all to variables to be passed down to statsviewer **
              playerName: res.data.global.name,
              playerLvl: res.data.global.level,
              totalData: res.data.total,
              banStatus: [res.data.global.bans],
              currentArenaRank: [res.data.global.arena],
              currentBrRank: [res.data.global.rank],
              recentlyUsedLegend: res.data.legends.selected,
            },
            console.log(res.data)
          ),
            setPlayerLegendData(res.data.legends.all);
        }
      })
      .catch((err) => showError(err.response.data.Error));
  }

  function showError(err) {
    setError(err);
  }

  const parsedPlayerLegendData = Object.entries(playerLegendData).filter(
    (entry) => entry[1].data
  );

  return (
    <Flex flexDirection={"column"}>
      <Header />
      <Search
        platform={platform}
        setPlatform={setPlatform}
        player={player}
        error={error}
        setPlayer={setPlayer}
        searchUser={searchUser}
        foundStats={foundStats}
      />
      <StatsViewer
        player={player}
        foundStats={foundStats}
        selectedLegend={selectedLegend}
        setSelectedLegend={setSelectedLegend}
        hoveredLegend={hoveredLegend}
        setHoveredLegend={setHoveredLegend}
        recentlyUsedLegend={foundStats.recentlyUsedLegend}
        parsedLegendData={parsedPlayerLegendData}
        playerLegendData={playerLegendData}
      />
      {props.children}
    </Flex>
  );
}

export default Layout;
