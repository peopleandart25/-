import { useState, type FormEvent } from "react";
import { changeAdminPassword } from "../../lib/adminAuth";

const fieldClass =
  "mt-2 w-full border-0 border-b border-charcoal/20 bg-transparent py-2 text-lg text-charcoal outline-none focus:border-orange";

export function PasswordManager() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (next !== confirm) {
      setOk(false);
      setMessage("새 비밀번호가 서로 일치하지 않습니다.");
      return;
    }
    const result = changeAdminPassword(current, next);
    setOk(result.ok);
    setMessage(result.message);
    if (result.ok) {
      setCurrent("");
      setNext("");
      setConfirm("");
    }
  };

  return (
    <section>
      <h2 className="font-display text-3xl text-charcoal">비밀번호 변경</h2>
      <p className="mt-2 max-w-xl text-lg text-black">
        로그인한 계정 비밀번호를 변경합니다. 이 브라우저에 저장되며, 다음
        로그인부터 새 비밀번호를 사용합니다.
      </p>

      <form onSubmit={onSubmit} className="mt-10 grid max-w-xl gap-6">
        <label>
          <span className="font-mono text-sm tracking-[0.18em] text-black">
            현재 비밀번호
          </span>
          <input
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(event) => setCurrent(event.target.value)}
            className={fieldClass}
          />
        </label>
        <label>
          <span className="font-mono text-sm tracking-[0.18em] text-black">
            새 비밀번호
          </span>
          <input
            type="password"
            autoComplete="new-password"
            value={next}
            onChange={(event) => setNext(event.target.value)}
            className={fieldClass}
          />
        </label>
        <label>
          <span className="font-mono text-sm tracking-[0.18em] text-black">
            새 비밀번호 확인
          </span>
          <input
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            className={fieldClass}
          />
        </label>
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="bg-orange px-8 py-3 font-mono text-xl tracking-[0.2em] text-charcoal hover:bg-orange-deep"
          >
            변경하기
          </button>
          {message ? (
            <p
              className={`text-lg ${ok ? "text-orange" : "text-black"}`}
              role="status"
            >
              {message}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
}
