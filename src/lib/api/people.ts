import data from "@/data/people.json";
import { fakeRequest, notFound } from "./client";

export interface Person {
  id: string;
  name: string;
  avatar?: string;
  headline: string;
  bio: string;
  tripsCount: number;
  countriesVisited: number;
  followers: number;
  tags: string[];
}

const PEOPLE = data as Person[];

export async function listPeople(): Promise<Person[]> {
  return fakeRequest(() => PEOPLE.slice().sort((a, b) => b.followers - a.followers));
}

export async function getPerson(id: string): Promise<Person> {
  return fakeRequest(() => {
    const found = PEOPLE.find((p) => p.id === id);
    if (!found) notFound("Person");
    return found;
  });
}
