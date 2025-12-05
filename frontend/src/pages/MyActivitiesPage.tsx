import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchMyActivities, cancelEnrollment } from "../features/activities/activitiesSlice";
import { fetchMessages, sendMessage, clearChat } from "../features/chat/chatSlice";

const MyActivitiesPage = () => {
  const dispatch = useAppDispatch();
  const { myActivities, myLoading, myError } = useAppSelector(
    (s) => s.activities
  );
  const { messages, loading: chatLoading, error: chatError } = useAppSelector(
    (s) => s.chat
  );
  const { user } = useAppSelector((s) => s.auth);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    dispatch(fetchMyActivities());
  }, [dispatch]);

  useEffect(() => {
    if (selectedId) {
      dispatch(fetchMessages(selectedId));
    } else {
      dispatch(clearChat());
    }
  }, [dispatch, selectedId]);

  const selectedActivity = myActivities.find((a) => a._id === selectedId);

  const handleSend = () => {
    if (!selectedId || !text.trim()) return;
    dispatch(sendMessage({ activityId: selectedId, text: text.trim() }));
    setText("");
  };

  const handleCancel = async () => {
    if (!selectedId) return;
    if (!confirm("คุณต้องการยกเลิกการสมัครกิจกรรมนี้หรือไม่?")) return;
    
    setCanceling(true);
    await dispatch(cancelEnrollment(selectedId));
    setCanceling(false);
    setSelectedId(null);
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="card bg-base-100 border border-primary/20 shadow-sm">
          <div className="card-body">
            <h1 className="card-title text-primary text-lg">
              เข้าสู่ระบบเพื่อดู “กิจกรรมของฉัน”
            </h1>
            <p className="text-sm text-gray-600">
              หน้านี้ใช้สำหรับดูรายการกิจกรรมที่คุณสมัครไว้
              และพูดคุยกับผู้จัดผ่านระบบแชท
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-[1.4fr,2fr] gap-4">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-primary mb-1">
          กิจกรรมที่ฉันสมัคร
        </h1>
        <p className="text-xs text-gray-600 mb-2">
          เลือกกิจกรรมที่คุณสมัครไว้ จากนั้นสามารถสนทนากับผู้จัดทางด้านขวา
        </p>

        {myLoading && (
          <div className="flex justify-center items-center h-32">
            <span className="loading loading-spinner" />
          </div>
        )}

        {myError && (
          <div className="alert alert-error text-xs">
            <span>{myError}</span>
          </div>
        )}

        {!myLoading && myActivities.length === 0 && (
          <p className="text-sm text-gray-500">
            คุณยังไม่ได้สมัครกิจกรรมใด ๆ ลองไปดูที่หน้า{" "}
            <span className="font-semibold">งานอาสา</span> แล้วเลือกกิจกรรมที่สนใจ
          </p>
        )}

        <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
          {myActivities.map((a) => (
            <button
              key={a._id}
              className={
                "w-full text-left card bg-base-100 border shadow-sm p-3 cursor-pointer " +
                (selectedId === a._id
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-primary/10")
              }
              onClick={() => setSelectedId(a._id || null)}
            >
              <div className="flex gap-3">
                {a.imageUrl && (
                  <img
                    src={a.imageUrl}
                    alt={a.title}
                    className="w-16 h-16 object-cover rounded-md border border-base-300"
                  />
                )}
                <div>
                  <p className="font-semibold text-sm text-primary">{a.title}</p>
                  <p className="text-[11px] text-gray-600 line-clamp-2">
                    {a.description}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1">
                    {a.date} • {a.time} • {a.province}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="card bg-base-100 border border-primary/20 shadow-sm flex flex-col">
        <div className="card-body p-4 flex flex-col h-full">
          <h2 className="card-title text-sm mb-2 text-primary">
            แชทกับผู้จัดกิจกรรม
          </h2>
          {!selectedActivity && (
            <div className="flex-1 flex items-center justify-center text-xs text-gray-500">
              เลือกกิจกรรมจากด้านซ้ายเพื่อเริ่มการสนทนา
            </div>
          )}
          {selectedActivity && (
            <>
              <div className="mb-2 text-xs text-gray-700">
                <p className="font-semibold text-sm text-primary">
                  {selectedActivity.title}
                </p>
                <p>
                  {selectedActivity.date} • {selectedActivity.time} •{" "}
                  {selectedActivity.location} ({selectedActivity.province})
                </p>
              </div>
              <div className="mb-2">
                <button
                  className="btn btn-error btn-sm w-full"
                  onClick={handleCancel}
                  disabled={canceling}
                >
                  {canceling ? "กำลังยกเลิก..." : "ยกเลิกการสมัคร"}
                </button>
              </div>
              {chatError && (
                <div className="alert alert-error py-1 text-[11px] mb-2">
                  <span>{chatError}</span>
                </div>
              )}
              <div className="flex-1 overflow-y-auto border border-base-300 rounded-lg p-2 space-y-2 bg-base-200">
                {chatLoading && (
                  <div className="flex justify-center py-4">
                    <span className="loading loading-spinner loading-sm" />
                  </div>
                )}
                {!chatLoading && messages.length === 0 && (
                  <p className="text-xs text-gray-500 text-center">
                    ยังไม่มีข้อความ เริ่มต้นพูดคุยกับผู้จัดได้เลย
                  </p>
                )}
                {!chatLoading &&
                  messages.map((m) => (
                    <div
                      key={m._id}
                      className={
                        "chat " +
                        (user && m.user === user.id ? "chat-end" : "chat-start")
                      }
                    >
                      <div className="chat-header text-[10px] mb-1 text-gray-600">
                        {user && m.user === user.id ? user.name : m.userName}
                      </div>
                      <div
                        className={
                          "chat-bubble text-xs " +
                          (user && m.user === user.id ? "chat-bubble-primary" : "")
                        }
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
              </div>
              <div className="mt-2 flex gap-2">
                <input
                  className="input input-bordered input-sm flex-1"
                  placeholder="พิมพ์ข้อความของคุณ..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={!user || !selectedId}
                />
                <button
                  className="btn btn-sm btn-primary"
                  onClick={handleSend}
                  disabled={!user || !selectedId}
                >
                  ส่ง
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyActivitiesPage;
