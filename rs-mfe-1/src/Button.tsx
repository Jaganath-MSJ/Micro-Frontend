import React from "react";

interface ButtonProps {
  onClick: () => void;
  name?: string;
  children?: React.ReactNode;
}

export default function Button(props: ButtonProps) {
  return (
    <button onClick={props.onClick}>
      {props?.name || "Button from Remote"}
    </button>
  );
}
