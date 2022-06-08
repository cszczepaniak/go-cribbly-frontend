import axios, { AxiosResponse } from "axios";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

type RouteParams = {
  gameID: string;
};

export const Game = () => {
  const params = useParams<RouteParams>();
  const { data, isLoading } = useQuery(["game", params.gameID], () =>
    getGame(params.gameID ?? "not possible")
  );

  const [loserScore, setLoserScore] = useState(0);
  const [winningTeam, setWinningTeam] = useState("");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleTeamChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    setWinningTeam(e.target.value);
  };

  const handleScoreChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    let score = parseInt(e.target.value);
    if (score > 120) {
      score = 120;
    }
    if (score < 0) {
      score = 0;
    }
    setLoserScore(score);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-row w-full h-screen sm:h-full justify-center mt-0 sm:mt-10">
      <div className="max-w-screen-sm w-full bg-slate-200 rounded-md">
        <div className="flex flex-col justify-between items-center py-2">
          <div className="text-3xl">{data?.teams[0]}</div>
          <div className="text-xl my-2">vs</div>
          <div className="text-3xl">{data?.teams[1]}</div>
          <div className="italic mt-2">{data?.kind} game</div>
        </div>
        <form className="flex flex-col p-2" onSubmit={handleSubmit}>
          <label className="mb-2 text-lg">Winning Team</label>
          <select
            value={winningTeam}
            onChange={handleTeamChange}
            className="form-select block w-full
              px-3 py-1.5 m-0 mb-2
              text-base font-normal text-gray-700
              bg-white bg-clip-padding bg-no-repeat
              border border-solid border-gray-300 rounded
              transition ease-in-out
              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          >
            <option selected={winningTeam === data?.teams[0]}>
              {data?.teams[0]}
            </option>
            <option selected={winningTeam === data?.teams[1]}>
              {data?.teams[1]}
            </option>
          </select>
          <label className="mb-2 text-lg">Loser Score</label>
          <input
            type="number"
            onChange={handleScoreChange}
            value={loserScore}
            className="form-input appearance-none block w-full
              px-3 py-1.5 m-0 mb-2
              text-base font-normal text-gray-700
              bg-white bg-clip-padding bg-no-repeat
              border border-solid border-gray-300 rounded
              transition ease-in-out
              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          />
          <button
            type="submit"
            className="
              px-3 py-1.5 my-2
              text-lg font-normal
              border border-solid border-gray-700 rounded
              bg-blue-400 hover:bg-blue-300 active:bg-blue-200"
          >
            Report Score
          </button>
        </form>
      </div>
    </div>
  );
};

type GameModel = {
  id: string;
  teams: string[];
  kind: string;
};

async function getGame(id: string): Promise<GameModel> {
  const resp: AxiosResponse<GameModel> = await axios.get(
    `https://luy8atxigb.execute-api.us-east-2.amazonaws.com/dev/games/${id}`
  );
  return resp.data;
}
