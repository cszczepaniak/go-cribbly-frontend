import axios, { AxiosResponse } from "axios";
import React, { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Game } from "./game/Game";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<DevPage />} />
          <Route path="/games/:gameID" element={<Game />} />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

function DevPage() {
  const queryClient = useQueryClient();
  const { isLoading, data: allGames } = useQuery("games", getGames);
  const [t1, setT1] = useState("");
  const [t2, setT2] = useState("");
  const newGame = useMutation(createGame, {
    onSuccess: (game) => {
      if (!allGames) {
        queryClient.setQueryData("games", [game]);
      } else {
        queryClient.setQueryData("games", [...allGames, game]);
      }
      queryClient.setQueryData(["game", game.id], game);
    },
  });

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <div className="m-4">
      <div className="mb-4">
        <h1 className="text-3xl mb-4">All Games</h1>
        <div>
          {allGames?.map((g, i) => (
            <div key={g.id}>
              <div>
                game {i}: <Link to={`/games/${g.id}`}>{g.id}</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-2xl">Create Game</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await newGame.mutateAsync({
              id: "",
              teams: [t1, t2],
            });
          }}
        >
          <label htmlFor="team1">Team 1</label>
          <input
            name="team1"
            type="text"
            value={t1}
            onChange={(e) => setT1(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md"
          />
          <label htmlFor="team2">Team 2</label>
          <input
            name="team2"
            type="text"
            value={t2}
            onChange={(e) => setT2(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md"
          />
          <button type="submit" className="bg-blue-300 p-2 my-2 rounded-md">
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

type GameModel = {
  id: string;
  teams: string[];
  kind: string;
};

async function getGames(): Promise<GameModel[]> {
  const resp: AxiosResponse<GameModel[]> = await axios.get(
    "https://luy8atxigb.execute-api.us-east-2.amazonaws.com/dev/games"
  );
  return resp.data;
}

async function createGame(game: GameModel): Promise<GameModel> {
  const { id, ...data } = game;
  data.kind = "prelim";
  const resp: AxiosResponse<GameModel> = await axios.post(
    "https://luy8atxigb.execute-api.us-east-2.amazonaws.com/dev/games",
    data
  );
  return resp.data;
}

export default App;
