import { Page } from "puppeteer";
import {
  IResponseListComic,
  ISourceInfo,
} from "./types";


export abstract class BaseBook {
  protected baseUrl: string;
  protected store:Record<string,any>

  constructor(comicInfo: ISourceInfo) {
    this.baseUrl = `https://${comicInfo.domain}`;
    this.store={}
  }
  // max 30 items
  abstract getTopDay(page: Page): Promise<IResponseListComic>; 
  abstract getTopWeek(page: Page): Promise<IResponseListComic>; 
  abstract getTopMonth(page: Page): Promise<IResponseListComic>;
  abstract getNew(page: Page): Promise<IResponseListComic>;
  abstract getFavorite(page: Page): Promise<IResponseListComic>;

  async crawl(page:Page){
    const topDay=await this.getTopDay(page)
    const topWeek=await this.getTopWeek(page)
    const topMonth=await this.getTopMonth(page)
    const bookNew=await this.getNew(page)
    const bookFavorite=await this.getFavorite(page)
    this.store={topDay,topWeek,topMonth,bookNew,bookFavorite}
  }

  async getResults(){
    return this.store
  }
  
  protected useSleep(s:number){
    return new Promise((resolve) => setTimeout(resolve, s * 1000));
  }
  protected async useScroll(page: Page, maxScrolls = 100) {
    let prevHeight = -1; let scrollCount = 0;
    while (scrollCount < maxScrolls) {
      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      let newHeight = await page.evaluate("document.body.scrollHeight");
      if (newHeight == prevHeight) {
        break;
      }
      scrollCount += 1;
    }
  }
}
