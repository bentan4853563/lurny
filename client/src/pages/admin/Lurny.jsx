import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Header from "../../components/Header";
import NewPagination from "../../components/NewPagination";

export default function Lurny() {
  const { lurnies } = useSelector((state) => state.lurny);

  const [stubsCount, setStubsCount] = useState(null);
  const [quizCount, setQuizCount] = useState(null);

  const [filteredLurnies, setFilteredLurnies] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Adjust as needed
  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    filteredLurnies &&
    filteredLurnies.length > 0 &&
    filteredLurnies.slice(indexOfFirstItem, indexOfLastItem);
  // Change page
  const paginate = useCallback((pageNumber) => setCurrentPage(pageNumber), []);

  useEffect(() => {
    if (lurnies.length > 0) {
      let filtered =
        stubsCount || quizCount
          ? lurnies.filter(
              (lurny) =>
                (!quizCount || lurny.quiz.length < quizCount) &&
                (!stubsCount || lurny.summary.length < stubsCount)
            )
          : lurnies;
      setFilteredLurnies(filtered);
    }
  }, [lurnies, stubsCount, quizCount]);

  return (
    <div className="w-full min-h-[100vh] font-raleway text-white">
      <Header />
      <div className="w-full px-[12rem] flex flex-col">
        <div className="flex gap-[2rem] py-[2rem]">
          <div className="flex flex-col items-start">
            <label className="text-[2rem]" htmlFor="">
              Count of Stubs
            </label>
            <input
              type="number"
              value={stubsCount}
              onChange={(e) => setStubsCount(e.target.value)}
              className=" bg-transparent border border-zinc-600 rounded-[0.5rem] focus:outline-zinc-700 px-[1rem] py-[0.5rem] text-[2rem]"
            />
          </div>
          <div className="flex flex-col items-start">
            <label className="text-[2rem]" htmlFor="">
              Count of Quiz
            </label>
            <input
              type="number"
              value={quizCount}
              onChange={(e) => setQuizCount(e.target.value)}
              className=" bg-transparent border border-zinc-600 rounded-[0.5rem] focus:outline-zinc-700 px-[1rem] py-[0.5rem] text-[2rem]"
            />
          </div>
        </div>

        <table className="w-full mt-[4rem] text-[2rem]">
          <thead>
            <tr>
              <th key="no">No</th>
              <th key="title">Title</th>
              <th className="w-[48rem]" key="url">
                URL
              </th>
              <th key="quiz">Quiz</th>
              <th key="stubs">Stubs</th>
              <th key="user">User</th>
            </tr>
          </thead>
          <tbody className="w-full">
            {currentItems &&
              currentItems.length > 0 &&
              currentItems.map((lurny, index) => (
                <tr key={lurny._id} className="w-full text-neutral-300">
                  <td>{index}</td>
                  <td className="px-[2rem] text-start">{lurny.title}</td>
                  <td className="w-[48rem] px-[2rem] text-start">
                    {lurny.url}
                  </td>
                  <td>{lurny.quiz.length}</td>
                  <td>{lurny.summary.length}</td>
                  <td className="px-[2rem] text-start">
                    {lurny.user.displayName}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {filteredLurnies && filteredLurnies.length > 0 && (
          <NewPagination
            totalItems={filteredLurnies && filteredLurnies.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            paginate={(value) => paginate(value)}
          />
        )}
      </div>
    </div>
  );
}
