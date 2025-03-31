import { RouteUser } from "@/store/auth";
import { useMemo } from "react";
export type FilteredRouteUsersSort = "isMe3rd" | "aToZ" | false;
export default function useFilteredRouteUsers(
  routeUsers: RouteUser[],
  sort: FilteredRouteUsersSort,
  search: string,
) {
  return useMemo(() => {
    let result = routeUsers || [];
    result = [...result];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter((item) =>
        item.user.name.toLowerCase().includes(searchLower),
      );
      sort = "aToZ";
    }

    if (sort) {
      if (sort == "isMe3rd") {
        result.sort((a, b) => a.routeIndex - b.routeIndex);
        const routeIndexOfMe =
          result.find((item) => item.isMe)?.routeIndex || 0;
        let routeIndexStarter = routeIndexOfMe;
        if (result.length > 5) {
          routeIndexStarter = routeIndexOfMe - 2;
          if (routeIndexStarter < 0) {
            routeIndexStarter = result.length + routeIndexStarter;
          }
        }

        result = [
          ...result.slice(routeIndexStarter),
          ...result.slice(0, routeIndexStarter - 1),
        ];
      } else if (sort == "aToZ") {
        result.sort((a, b) => a.user.name.localeCompare(b.user.name));
      }
    }

    return result;
  }, [routeUsers, sort, search]);
}
