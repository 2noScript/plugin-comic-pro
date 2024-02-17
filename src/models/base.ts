import { Browser } from "puppeteer";
import { browser } from "../utils";
import {
  chapter,
  genre,
  responseChapter,
  responseDetailComic,
  responseListComic,
} from "./types";

export interface AbstractComicFactory {
  baseUrl: string;
  browser?: Promise<Browser>;

  getListLatestUpdate(page?: number): Promise<responseListComic>;

  getDetailComic(url: string): Promise<responseDetailComic>;

  getDataChapter(
    url_chapter: string,
    url?: string,
    path?: string,
    prev_chapter?: chapter,
    next_chapter?: chapter
  ): Promise<responseChapter>;

  getListByGenre(
    genre: genre,
    page?: number,
    status?: any,
    sort?: any
  ): Promise<responseListComic>;

  getAllGenres(): Promise<genre[]>;

  search(keyword: string, page?: number): Promise<responseListComic>;
}

const defaultResponseListComic: responseListComic = {
  totalData: 0,
  canNext: false,
  canPrev: false,
  totalPage: 0,
  currentPage: 0,
  data: [],
};

const defaultResponseDetailComic: responseDetailComic = {
  path: "",
  url: "",
  author: "",
  title: "",
  status: "",
  genres: [],
  views: "",
  rate: "",
  rate_number: "",
  follows: "",
  chapters: [],
};
const defaultResponseChapter: responseChapter = {
  url: "",
  path: "",
  title: "",
  chapter_data: [],
  prev_chapter: null,
  next_chapter: null,
};

export class BaseComic implements AbstractComicFactory {
  baseUrl: string;
  browser: Promise<Browser>;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.browser = browser;
  }

  async search(keyword: string, page = 1): Promise<responseListComic> {
    return defaultResponseListComic;
  }

  async getListLatestUpdate(page?: number): Promise<responseListComic> {
    return defaultResponseListComic;
  }

  async getDetailComic(url: string): Promise<responseDetailComic> {
    return defaultResponseDetailComic;
  }

  async getDataChapter(
    url_chapter: string,
    url?: string,
    path?: string,
    prev_chapter?: chapter,
    next_chapter?: chapter
  ): Promise<responseChapter> {
    return defaultResponseChapter;
  }

  async getListByGenre(
    genre: genre,
    page?: number,
    status?: any,
    sort?: any
  ): Promise<responseListComic> {
    return defaultResponseListComic;
  }
  async getAllGenres(): Promise<genre[]> {
    return [];
  }
}
