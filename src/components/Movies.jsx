import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "./partials/Dropdown";
import axios from "../utils/axios";
import VerticalCards from "./partials/VerticalCards";
import Loading from "./Loading";
import InfiniteScroll from "react-infinite-scroll-component";

function Movies() {
  document.title = "Sakura DB | Movies";
  const navigate = useNavigate();
  const [category, setCategory] = useState("popular");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const getMovies = async (reset = false) => {
    try {
      const { data } = await axios.get(`/movie/${category}?page=${page}`);
      if (data.results.length === 0) {
        setHasMore(false);
      } else {
        setMovies((prevState) =>
          reset ? data.results : [...prevState, ...data.results]
        );
        setPage((prevPage) => prevPage + 1);
      }
    } catch (err) {
      console.log("Error: " + err);
    }
  };

  const refreshHandler = () => {
    setPage(1);
    setMovies([]);
    setHasMore(true);
    getMovies(true);
  };

  useEffect(() => {
    refreshHandler();
  }, [category]);

  useEffect(() => {
    if (page > 1) {
      getMovies();
    }
  }, [page]);

  return movies.length > 0 ? (
    <div className="w-[100%] h-screen overflow-hidden overflow-y-auto p-10">
      <div className="px-[3%] w-full flex items-center justify-between gap-[25%]">
        <h1 className="text-2xl text-zinc-400 font-semibold">
          <i
            onClick={() => navigate(-1)}
            className="hover:text-[#6556CD] pr-3 ri-arrow-left-line"
          ></i>
          Movies
        </h1>
        <div className="flex items-center w-[80%]">
          <Dropdown
            title="Category"
            options={["popular", "now_playing", "top_rated", "upcoming"]}
            func={(e) => setCategory(e.target.value)}
            selectedOption={category}
          />
          <div className="w-[2%]"></div>
        </div>
      </div>

      <InfiniteScroll
        loader={<h1>Loading</h1>}
        dataLength={movies.length}
        next={() => setPage((prevPage) => prevPage + 1)}
        hasMore={hasMore}
      >
        <VerticalCards data={movies} title="movie" />
      </InfiniteScroll>
    </div>
  ) : (
    <Loading />
  );
}

export default Movies;
