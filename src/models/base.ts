import { Browser, Page } from "puppeteer";
import { textMaster } from "text-master-pro";

import {
  IChapter,
  IGenre,
  IComic,
  IResponseChapter,
  IResponseDetailComic,
  IResponseListComic,
  IComicInfo,
} from "./types";
import parse from "node-html-parser";

export abstract class BaseComic {
  public comicInfo: IComicInfo;
  protected baseUrl: string;
  protected page!: Page;

  protected textMaster: (txt: string) => any;

  constructor(comicInfo: IComicInfo) {
    this.baseUrl = comicInfo.source;
    this.comicInfo = comicInfo;
    this.textMaster = textMaster;
  }

  protected getHtmlParser(raw: string) {
    return parse(raw);
  }
  protected async getPage() {
    return;
  }
  abstract getAllGenres(): Promise<IGenre[]>;
  abstract search(keyword: string, page?: number): Promise<IResponseListComic>;

  abstract getListLatestUpdate(page?: number): Promise<IResponseListComic>;
  abstract getListComplete(page?: number): Promise<IResponseListComic>;
  abstract getListNew(page?: number): Promise<IResponseListComic>;
  abstract getTopHot(): Promise<IResponseListComic>; // limit 15
  abstract getTopWeek(): Promise<IResponseListComic>; // limit 15

  abstract getListByGenre(
    genre: IGenre,
    page?: number
  ): Promise<IResponseListComic>;

  abstract getDetailComic(comic: IComic): Promise<IResponseDetailComic>;
  abstract getDataChapter(itemChap: IChapter): Promise<IResponseChapter>;
}
