import React from "react";

export const Label = ({ children, ...props }) => (
  <label {...props} className="text-sm font-medium text-gray-700">
    {children}
  </label>
);
