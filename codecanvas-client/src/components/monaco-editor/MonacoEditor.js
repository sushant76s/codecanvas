import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

const MonacoEditor = () => {
  const [code, setCode] = useState("");

  const handleEditorChange = (data) => {
    // console.log("data: ", data);
    setCode(data);
    // onChange(data);
    // socketRef.current.emit(ACTIONS.CODE_CHANGE, {
    //   roomId,
    //   code: data,
    // });
  };
  return (
    <>
      <Editor
        height="85vh"
        width={`100%`}
        language="javascript"
        value={code}
        theme="vs-dark"
        onChange={handleEditorChange}
      />
    </>
  );
};

export default MonacoEditor;
