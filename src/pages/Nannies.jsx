import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";

import {
  Filter,
  LoadMoreButton,
  Loader,
  NanniesList,
  TitleWrapper,
} from "../components";
import { getNanniesFilter } from "../helpers";
import { getNannies, getNanniesTotal } from "../services";

const Nannies = () => {
  const [nannies, setNannies] = useState([]);
  const [filteredNannies, setFilteredNannies] = useState([]);
  const [page, setPage] = useState(1);
  const [lastIndex, setLastIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("Show all");

  const loadNannies = useCallback(async () => {
    try {
      setIsLoading(true);
      const total = await getNanniesTotal();
      setIsLoadMore(page * 3 < total);

      if (page * 3 >= total) {
        toast.info("You have reached the end of the list of nannies.");
      }

      const newNannies = await getNannies(lastIndex);

      if (newNannies.length) {
        const updatedNannies = [...nannies, ...newNannies];
        setNannies(updatedNannies);
        setLastIndex(newNannies[newNannies.length - 1].id);

        const filtered = getNanniesFilter(updatedNannies, currentFilter);
        setFilteredNannies(filtered);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [page, lastIndex, nannies, currentFilter]);

  useEffect(() => {
    loadNannies();
  }, [page]);

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
    const filtered = getNanniesFilter(nannies, filter);
    setFilteredNannies(filtered);
  };

  const onLoadMoreClick = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (isLoading && !nannies.length) {
    return <Loader />;
  }

  return (
    <div className="bg-bgLightColor min-h-screen">
      <div className="container bg-bgLightColor pt-[64px] pb-[100px]">
        {nannies.length > 0 && <Filter filterFunction={handleFilterChange} />}
        {filteredNannies.length ? (
          <NanniesList nannies={filteredNannies} />
        ) : (
          <TitleWrapper title="Sorry...No nannies found." />
        )}
        {isLoadMore && filteredNannies.length > 0 && (
          <LoadMoreButton onClick={onLoadMoreClick} />
        )}
      </div>
      {isLoading && <Loader />}
    </div>
  );
};

export default Nannies;
