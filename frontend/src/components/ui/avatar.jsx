import * as React from "react";

export function Avatar({ children, className, ...props }) {
  return (
    <div className={`inline-block w-10 h-10 rounded-full overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt, className, ...props }) {
  return (
    <img src={src} alt={alt} className={`w-full h-full object-cover ${className}`} {...props} />
  );
}
