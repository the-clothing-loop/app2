import { Link, LinkProps } from "expo-router";
import { PropsWithChildren } from "react";

export default function OptionalLink({
  children,
  ...props
}: PropsWithChildren<Omit<LinkProps, "href"> & { href?: LinkProps["href"] }>) {
  if (props.href == undefined) return children;
  return <Link {...(props as LinkProps)}>{children}</Link>;
}
