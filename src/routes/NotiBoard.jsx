import axios from "axios";
import { Link, useLoaderData } from "react-router-dom";
import "../assets/css/Board.css";
import { extractDateOnly } from "../util/functionUtil";
import { useState } from "react";
import Noti from "../components/Noti.jsx";
import { useUserState } from "../contexts/UserContext.jsx";

export default function NotiBoard() {
  const response = useLoaderData();
  const notiList = response.notiList;
  const [show, setShow] = useState(false);
  const [userContext] = useUserState();

  const isUserAdmin = userContext && userContext.mem_class == 9;

  function handleShow() {
    setShow(true);
  }
  function handleClose() {
    setShow(false);
  }

  return (
    <div className="board-container">
      <strong className="board-header">공지사항</strong>
      <div className="board-table">
        <div className="board-table-header">
          <div className="board-num">번호</div>
          <div className="board-title">제목</div>
          <div className="board-user">작성자</div>
          <div className="board-cnt">조회수</div>
          <div className="board-regDate">작성일</div>
        </div>
        {notiList &&
          notiList.map((noti, idx) => {
            return (
              <Link
                to={`/detailNoti/${noti.noti_no}`}
                key={noti.noti_no}
                className="board-link"
              >
                <div className="board-column">
                  <div className="board-num">{idx + 1}</div>
                  <div className="board-title">{noti.noti_title}</div>
                  <div className="board-user">{noti.mem_name}</div>
                  <div className="board-cnt">{noti.noti_cnt}</div>
                  <div className="board-regDate">
                    {extractDateOnly(noti.reg_date)}
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
      <div className="boardBtn">
        {isUserAdmin &&<button onClick={handleShow}>공지작성</button>}
        <Noti show={show} onHide={handleClose} />
      </div>
    </div>
  );
}

export async function loader() {
  const notiList = await axios({
    url: "http://localhost:8080/board/notiList",
    method: "get",
    withCredentials: true,
  }).then((res) => {
    return res.data.data.notiList;
  });

  const resData = { notiList: notiList };
  return resData;
}
