import type { User } from "../types";

/**
 * Mock user data for the user dashboard.
 *
 * Array of 7 users with different permission levels for testing
 * search and filter functionality. Users have varied names to
 * support name-based searching.
 */
export const mockUsers: User[] = [
  {
    name: "George Harris",
    role: "Software Engineer",
    permission: "admin",
    team: "Security",
    contactInfo: "george.harris@example.com",
  },
  {
    name: "Arianna Russo",
    role: "Product Designer",
    permission: "editor",
    team: "Website",
    contactInfo: "arianna.russo@example.com",
  },
  {
    name: "Marco Esposito",
    role: "Software Engineer",
    permission: "viewer",
    team: "Finance",
    contactInfo: "marco.esposito@example.com",
  },
  {
    name: "Sarah Williams",
    role: "Product Designer",
    permission: "guest",
    team: "Security",
    contactInfo: "sarah.williams@example.com",
  },
  {
    name: "Emma Clark",
    role: "Product Manager",
    permission: "guest",
    team: "Marketing",
    contactInfo: "emma.clark@example.com",
  },
  {
    name: "Victor Barnes",
    role: "Product Manager",
    permission: "viewer",
    team: "Finance",
    contactInfo: "victor.barnes@example.com",
  },
  {
    name: "Serena Parisi",
    role: "Product Designer",
    permission: "guest",
    team: "Marketing",
    contactInfo: "serena.parisi@example.com",
  },
];
