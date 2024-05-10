import { useState } from "react";

export default function ContentSubmissionModal() {
  const [text, setText] = useState(null);

  return (
    <div className="fixed inset-0 z-50 bg-zinc-600/50">
      <div className="bg-white w-[64rem] h-2/3">
        <textarea
          name="text"
          id="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
        <button className="bg-[#7F52BB]">Submit Text</button>
      </div>
    </div>
  );
}
