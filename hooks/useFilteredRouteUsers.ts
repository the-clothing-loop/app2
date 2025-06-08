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

export interface FilteredRouteUser {
  bags: Bag[];
  routeUser: RouteUser;
  latestBagUpdate: number;
}

export default function useFilteredRouteUsers(
  routeUsers: RouteUser[],
  bagsPerUser: Record<string, Bag[]>,
  sort: FilteredRouteUsersSort,
  search: string,
) {
  return useMemo<FilteredRouteUser[]>(() => {
    let result = [...(routeUsers || [])].map((routeUser) => {
      const bags = bagsPerUser[routeUser.user.uid] || [];
      const latestBagUpdate = bags.reduce<number>((acc, value) => {
        const updatedAtMilli = dayjs(value.updated_at).toDate().valueOf() || 0;
        if (acc < updatedAtMilli) return updatedAtMilli;
        return acc;
      }, -1);
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
        result.sort((a, b) =>
          a.routeUser.routeIndex > b.routeUser.routeIndex ? 1 : 0,
        );
        if (result.length > 5) {
          const routeIndexOfMe =
            result.findIndex(({ routeUser }) => routeUser.isMe) || 0;
          let routeIndexStarter = routeIndexOfMe;
          routeIndexStarter = routeIndexOfMe - 2;
          if (routeIndexStarter < 0) {
            routeIndexStarter = result.length + routeIndexStarter;
          }

          if (routeIndexStarter !== 0)
            result = [
              ...result.slice(routeIndexStarter, undefined),
              ...result.slice(0, routeIndexStarter - 1),
            ];
        }
      } else if (sort == "aToZ" || sort == "zToA") {
        result.sort((a, b) =>
          a.routeUser.user.name.localeCompare(b.routeUser.user.name),
        );
        if (sort == "zToA") {
          result.reverse();
        }
      } else if (sort == "dateLastSwapped") {
        result.sort((a, b) =>
          a.latestBagUpdate === -1
            ? 1
            : b.latestBagUpdate === -1
              ? -1
              : a.latestBagUpdate > b.latestBagUpdate
                ? -1
                : a.latestBagUpdate < b.latestBagUpdate
                  ? 1
                  : 0,
        );
      } else if (sort == "dateLastSwappedRev") {
        result.sort((a, b) =>
          a.latestBagUpdate === -1
            ? 1
            : b.latestBagUpdate === -1
              ? -1
              : a.latestBagUpdate < b.latestBagUpdate
                ? -1
                : a.latestBagUpdate > b.latestBagUpdate
                  ? 1
                  : 0,
        );
      } else if (sort == "route1toN") {
        result.sort((a, b) => a.routeUser.routeIndex - b.routeUser.routeIndex);
      }
    }

    return result;
  }, [routeUsers, sort, search]);
}
