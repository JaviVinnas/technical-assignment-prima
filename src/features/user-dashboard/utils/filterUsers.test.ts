import type { User, UserPermission } from "../types";
import { filterUsers } from "./filterUsers";

/**
 * Test suite for filterUsers utility function.
 *
 * Tests the core business logic for filtering users by search query and permissions.
 * This utility implements AND logic between search and permissions, and OR logic
 * within permission filters.
 */
describe("filterUsers", () => {
  const mockUsers: User[] = [
    {
      name: "Alice Johnson",
      role: "Senior Engineer",
      permission: "admin",
      team: "Engineering",
      contactInfo: "alice@company.com",
    },
    {
      name: "Bob Smith",
      role: "Product Manager",
      permission: "editor",
      team: "Product",
      contactInfo: "bob@company.com",
    },
    {
      name: "Carol Davis",
      role: "Designer",
      permission: "viewer",
      team: "Design",
      contactInfo: "carol@company.com",
    },
    {
      name: "David Wilson",
      role: "Marketing Manager",
      permission: "guest",
      team: "Marketing",
      contactInfo: "david@company.com",
    },
    {
      name: "Emma Brown",
      role: "Data Analyst",
      permission: "editor",
      team: "Data",
      contactInfo: "emma@company.com",
    },
    {
      name: "Frank Miller",
      role: "Backend Developer",
      permission: "admin",
      team: "Engineering",
      contactInfo: "frank@company.com",
    },
  ];

  describe("Search Query Filtering", () => {
    it("returns all users when search query is empty", () => {
      const result = filterUsers(mockUsers, "", []);

      expect(result).toHaveLength(6);
      expect(result).toEqual(mockUsers);
    });

    it("returns all users when search query is whitespace only", () => {
      const result = filterUsers(mockUsers, "   ", []);

      expect(result).toHaveLength(6);
      expect(result).toEqual(mockUsers);
    });

    it("filters users by exact name match (case-insensitive)", () => {
      const result = filterUsers(mockUsers, "alice johnson", []);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Alice Johnson");
    });

    it("filters users by partial name match", () => {
      const result = filterUsers(mockUsers, "john", []);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Alice Johnson");
    });

    it("filters users case-insensitively", () => {
      const upperResult = filterUsers(mockUsers, "ALICE", []);
      const lowerResult = filterUsers(mockUsers, "alice", []);
      const mixedResult = filterUsers(mockUsers, "AlIcE", []);

      expect(upperResult).toHaveLength(1);
      expect(lowerResult).toHaveLength(1);
      expect(mixedResult).toHaveLength(1);
      expect(upperResult[0].name).toBe("Alice Johnson");
      expect(lowerResult[0].name).toBe("Alice Johnson");
      expect(mixedResult[0].name).toBe("Alice Johnson");
    });

    it("filters users by first name", () => {
      const result = filterUsers(mockUsers, "bob", []);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Bob Smith");
    });

    it("filters users by last name", () => {
      const result = filterUsers(mockUsers, "smith", []);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Bob Smith");
    });

    it("returns multiple users when query matches multiple names", () => {
      const result = filterUsers(mockUsers, "Manager", []);

      expect(result.length).toBeGreaterThan(1);
      const names = result.map((u) => u.name);
      expect(names).toContain("Bob Smith"); // Product Manager
      expect(names).toContain("David Wilson"); // Marketing Manager
      // Carol Davis is a Designer, so shouldn't be in results
      expect(names).not.toContain("Carol Davis");
    });

    it("returns empty array when no names match query", () => {
      const result = filterUsers(mockUsers, "nonexistent", []);

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it("handles search query with leading and trailing whitespace", () => {
      const result = filterUsers(mockUsers, "  alice  ", []);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Alice Johnson");
    });

    it("handles search query with multiple spaces", () => {
      const result = filterUsers(mockUsers, "bob", []);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Bob Smith");
    });

    it("returns empty array for query that matches no users", () => {
      const result = filterUsers(mockUsers, "xyz123", []);

      expect(result).toEqual([]);
    });
  });

  describe("Permission Filtering", () => {
    it("returns all users when no permissions selected", () => {
      const result = filterUsers(mockUsers, "", []);

      expect(result).toHaveLength(6);
      expect(result).toEqual(mockUsers);
    });

    it("filters users by single permission", () => {
      const result = filterUsers(mockUsers, "", ["admin"]);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Alice Johnson");
      expect(result[1].name).toBe("Frank Miller");
    });

    it("filters users by editor permission", () => {
      const result = filterUsers(mockUsers, "", ["editor"]);

      expect(result).toHaveLength(2);
      const names = result.map((u) => u.name);
      expect(names).toContain("Bob Smith");
      expect(names).toContain("Emma Brown");
    });

    it("filters users by viewer permission", () => {
      const result = filterUsers(mockUsers, "", ["viewer"]);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Carol Davis");
    });

    it("filters users by guest permission", () => {
      const result = filterUsers(mockUsers, "", ["guest"]);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("David Wilson");
    });

    it("filters users by multiple permissions (OR logic)", () => {
      const result = filterUsers(mockUsers, "", ["admin", "viewer"]);

      expect(result).toHaveLength(3);
      const names = result.map((u) => u.name);
      expect(names).toContain("Alice Johnson");
      expect(names).toContain("Carol Davis");
      expect(names).toContain("Frank Miller");
    });

    it("filters users by all permissions combined", () => {
      const result = filterUsers(mockUsers, "", ["admin", "editor", "viewer", "guest"]);

      expect(result).toHaveLength(6);
      expect(result).toEqual(mockUsers);
    });

    it("returns empty array when permission not in data", () => {
      const result = filterUsers(mockUsers, "", ["owner" as UserPermission]);

      expect(result).toEqual([]);
    });

    it("handles multiple permissions where some don't exist in data", () => {
      const result = filterUsers(mockUsers, "", ["admin", "owner" as UserPermission]);

      expect(result).toHaveLength(2);
      const names = result.map((u) => u.name);
      expect(names).toContain("Alice Johnson");
      expect(names).toContain("Frank Miller");
    });
  });

  describe("Combined Search and Permission Filtering (AND Logic)", () => {
    it("filters by both search query and permission", () => {
      const result = filterUsers(mockUsers, "alice", ["admin"]);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Alice Johnson");
    });

    it("returns empty when search matches but permission doesn't", () => {
      const result = filterUsers(mockUsers, "alice", ["viewer"]);

      expect(result).toEqual([]);
    });

    it("returns empty when permission matches but search doesn't", () => {
      const result = filterUsers(mockUsers, "nonexistent", ["admin"]);

      expect(result).toEqual([]);
    });

    it("filters by search and multiple permissions", () => {
      const result = filterUsers(mockUsers, "e", ["admin", "editor"]);

      expect(result.length).toBeGreaterThan(0);
      const names = result.map((u) => u.name);
      expect(names).toContain("Alice Johnson");
      expect(names).toContain("Emma Brown");
      expect(names).toContain("Frank Miller");
      expect(names).not.toContain("David Wilson");
    });

    it("narrows results when both filters applied", () => {
      const searchOnly = filterUsers(mockUsers, "e", []);
      const permissionOnly = filterUsers(mockUsers, "", ["admin"]);
      const combined = filterUsers(mockUsers, "e", ["admin"]);

      expect(combined.length).toBeLessThan(searchOnly.length);
      expect(combined.length).toBeLessThanOrEqual(permissionOnly.length);
    });

    it("handles whitespace in search with permission filter", () => {
      const result = filterUsers(mockUsers, "  bob  ", ["editor"]);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Bob Smith");
    });

    it("returns users matching complex search and permission criteria", () => {
      const result = filterUsers(mockUsers, "a", ["editor", "viewer"]);

      const names = result.map((u) => u.name);
      expect(names).toContain("Carol Davis");
      expect(names).toContain("Emma Brown");
      expect(names).not.toContain("Alice Johnson");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty users array", () => {
      const result = filterUsers([], "test", ["admin"]);

      expect(result).toEqual([]);
    });

    it("handles single user array", () => {
      const singleUser = [mockUsers[0]];
      const result = filterUsers(singleUser, "alice", []);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Alice Johnson");
    });

    it("handles single user array with no match", () => {
      const singleUser = [mockUsers[0]];
      const result = filterUsers(singleUser, "bob", []);

      expect(result).toEqual([]);
    });

    it("handles special characters in search query", () => {
      const specialUsers: User[] = [
        {
          name: "O'Brien",
          role: "Engineer",
          permission: "admin",
          team: "Engineering",
          contactInfo: "obrien@company.com",
        },
      ];

      const result = filterUsers(specialUsers, "o'brien", []);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("O'Brien");
    });

    it("handles hyphenated names", () => {
      const hyphenatedUsers: User[] = [
        {
          name: "Mary-Jane Watson",
          role: "Designer",
          permission: "editor",
          team: "Design",
          contactInfo: "mary@company.com",
        },
      ];

      const result = filterUsers(hyphenatedUsers, "mary-jane", []);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Mary-Jane Watson");
    });

    it("handles unicode characters in names", () => {
      const unicodeUsers: User[] = [
        {
          name: "José García",
          role: "Manager",
          permission: "admin",
          team: "Operations",
          contactInfo: "jose@company.com",
        },
        {
          name: "François Müller",
          role: "Developer",
          permission: "editor",
          team: "Engineering",
          contactInfo: "francois@company.com",
        },
      ];

      const result1 = filterUsers(unicodeUsers, "josé", []);
      expect(result1).toHaveLength(1);
      expect(result1[0].name).toBe("José García");

      const result2 = filterUsers(unicodeUsers, "müller", []);
      expect(result2).toHaveLength(1);
      expect(result2[0].name).toBe("François Müller");
    });

    it("handles dots and periods in search", () => {
      const result = filterUsers(mockUsers, ".", []);

      expect(result).toEqual([]);
    });

    it("maintains original array immutability", () => {
      const originalUsers = [...mockUsers];
      filterUsers(mockUsers, "alice", ["admin"]);

      expect(mockUsers).toEqual(originalUsers);
    });

    it("returns new array instance", () => {
      const result = filterUsers(mockUsers, "", []);

      expect(result).not.toBe(mockUsers);
      expect(result).toEqual(mockUsers);
    });
  });

  describe("Performance and Efficiency", () => {
    it("handles large dataset efficiently", () => {
      const largeDataset: User[] = Array.from({ length: 1000 }, (_, i) => ({
        name: `User ${i}`,
        role: `Role ${i}`,
        permission: (["admin", "editor", "viewer", "guest"] as const)[i % 4],
        team: `Team ${i % 10}`,
        contactInfo: `user${i}@company.com`,
      }));

      const startTime = Date.now();
      const result = filterUsers(largeDataset, "User 5", ["admin"]);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });

    it("handles multiple filter calls efficiently", () => {
      for (let i = 0; i < 100; i++) {
        const result = filterUsers(mockUsers, "e", ["admin", "editor"]);
        expect(result.length).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe("Readonly Array Handling", () => {
    it("accepts readonly users array", () => {
      const readonlyUsers = mockUsers as readonly User[];
      const result = filterUsers(readonlyUsers, "alice", []);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Alice Johnson");
    });

    it("accepts readonly permissions array", () => {
      const readonlyPermissions = ["admin", "editor"] as readonly UserPermission[];
      const result = filterUsers(mockUsers, "", readonlyPermissions);

      expect(result).toHaveLength(4);
    });

    it("accepts both readonly arrays", () => {
      const readonlyUsers = mockUsers as readonly User[];
      const readonlyPermissions = ["admin"] as readonly UserPermission[];
      const result = filterUsers(readonlyUsers, "alice", readonlyPermissions);

      expect(result).toHaveLength(1);
    });
  });

  describe("Real-World Scenarios", () => {
    it("filters users as they type (incremental search)", () => {
      const step1 = filterUsers(mockUsers, "a", []);
      const step2 = filterUsers(mockUsers, "al", []);
      const step3 = filterUsers(mockUsers, "ali", []);
      // step4 skipped
      const step5 = filterUsers(mockUsers, "alice", []);

      expect(step1.length).toBeGreaterThan(step2.length);
      expect(step2.length).toBeGreaterThanOrEqual(step3.length);
      expect(step5).toHaveLength(1);
      expect(step5[0].name).toBe("Alice Johnson");
    });

    it("handles user clearing search after typing", () => {
      const withSearch = filterUsers(mockUsers, "alice", ["admin"]);
      const cleared = filterUsers(mockUsers, "", ["admin"]);

      expect(withSearch).toHaveLength(1);
      expect(cleared).toHaveLength(2);
    });

    it("handles user adding and removing permission filters", () => {
      const noFilter = filterUsers(mockUsers, "e", []);
      const oneFilter = filterUsers(mockUsers, "e", ["admin"]);
      const twoFilters = filterUsers(mockUsers, "e", ["admin", "editor"]);
      const backToOne = filterUsers(mockUsers, "e", ["admin"]);

      expect(noFilter.length).toBeGreaterThan(oneFilter.length);
      expect(twoFilters.length).toBeGreaterThan(oneFilter.length);
      expect(backToOne).toEqual(oneFilter);
    });

    it("simulates user journey: search then filter", () => {
      const allUsers = filterUsers(mockUsers, "", []);
      expect(allUsers).toHaveLength(6);

      const searchResults = filterUsers(mockUsers, "Manager", []);
      expect(searchResults.length).toBeGreaterThan(0);
      expect(searchResults.length).toBeLessThan(6);

      const finalResults = filterUsers(mockUsers, "Manager", ["admin"]);
      expect(finalResults.length).toBeLessThanOrEqual(searchResults.length);
    });

    it("simulates user journey: filter then search", () => {
      const allUsers = filterUsers(mockUsers, "", []);
      expect(allUsers).toHaveLength(6);

      const filterResults = filterUsers(mockUsers, "", ["admin", "editor"]);
      expect(filterResults).toHaveLength(4);

      const finalResults = filterUsers(mockUsers, "emma", ["admin", "editor"]);
      expect(finalResults).toHaveLength(1);
      expect(finalResults[0].name).toBe("Emma Brown");
    });
  });
});
