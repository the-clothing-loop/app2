import { Bag } from "@/api/typex2";
import { RouteUser } from "@/store/auth";
import dayjs from "dayjs";
import { useMemo } from "react";

export type FilteredRouteUsersSort =
  | "route1toN"
  | "routeForMe"
  | "aToZ"
  | "zToA"
  | "dateLastSwapped"
  | "dateLastSwappedRev";

export default function useFilteredRouteUsers(
  routeUsers: RouteUser[],
  bagsPerUser: Record<string, Bag[]>,
  sort: FilteredRouteUsersSort,
  search: string,
) {
  return useMemo(() => {
    let result = [...(routeUsers || [])].map((routeUser) => {
      const bags = bagsPerUser[routeUser.user.uid] || [];
      const latestBagUpdate = bags.reduce<number>((acc, value) => {
        const updatedAtMilli = dayjs(value.updated_at).toDate().valueOf();
        if (acc < updatedAtMilli) return updatedAtMilli;
        return acc;
      }, 0);
      return {
        bags,
        routeUser,
        latestBagUpdate,
      };
    });

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(({ routeUser }) =>
        routeUser.user.name.toLowerCase().includes(searchLower),
      );
      sort = "aToZ";
    }

    if (sort) {
      if (sort == "routeForMe") {
        result.sort((a, b) => a.routeUser.routeIndex - b.routeUser.routeIndex);
        const routeIndexOfMe =
          result.find(({ routeUser }) => routeUser.isMe)?.routeUser
            .routeIndex || 0;
        let routeIndexStarter = routeIndexOfMe;
        if (result.length > 5) {
          routeIndexStarter = routeIndexOfMe - 2;
          if (routeIndexStarter < 0) {
            routeIndexStarter = result.length + routeIndexStarter;
          }
        }

        if (routeIndexStarter !== 0)
          result = [
            ...result.slice(routeIndexStarter),
            ...result.slice(0, routeIndexStarter - 1),
          ];
      } else if (sort == "aToZ" || sort == "zToA") {
        result.sort((a, b) =>
          a.routeUser.user.name.localeCompare(b.routeUser.user.name),
        );
      } else if (sort == "dateLastSwapped" || sort == "dateLastSwappedRev") {
        result.sort((a, b) =>
          b.latestBagUpdate === 0
            ? 1
            : a.latestBagUpdate > b.latestBagUpdate
              ? -1
              : 0,
        );
      } else if (sort == "route1toN") {
        result.sort((a, b) => a.routeUser.routeIndex - b.routeUser.routeIndex);
      }
      if (sort == "zToA" || sort == "dateLastSwappedRev") {
        result.reverse();
      }
    }

    return result;
  }, [routeUsers, sort, search]);
}
