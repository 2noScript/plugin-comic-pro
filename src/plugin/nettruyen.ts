import { BaseComic } from "../models/base";
import {
  chapter,
  genre,
  itemComic,
  responseDetailComic,
  responseListComic,
} from "../models/types";
import { getHtmlParser, removeVietnameseAccent } from "../utils";

export class NetTruyen extends BaseComic {
  private async getListComic(url: string): Promise<responseListComic> {
    let data: itemComic[] = [];
    const root = await getHtmlParser(url);
    const books = root.querySelectorAll("#ctl00_divCenter .items .item");
    const canPrev = !!root.querySelector(".pagination .prev-page");
    const canNext = !!root.querySelector(".pagination .next-page");
    const totalPage =
      root
        .querySelector(".pagination .hidden")
        ?.innerText?.split("/")
        ?.pop()
        ?.trim() ?? 1;
    books.forEach((book) => {
      const a = book.querySelector(".image a");
      data.push({
        _id: Number(a?.getAttribute("href")?.split("-")?.pop()),
        image_thumbnail:
          a?.querySelector("img")?.getAttribute("data-original") ??
          a?.querySelector("img")?.getAttribute("src") ??
          "",
        title:
          a?.getAttribute("title") ??
          a?.querySelector("img")?.getAttribute("alt") ??
          "",
        href: a?.getAttribute("href")?.replace(this.baseUrl, "") ?? "",
      });
    });

    return {
      totalData: data.length,
      canNext,
      canPrev,
      totalPage: Number(totalPage),
      currentPage: Number(new URL(url).searchParams.get("page") ?? 1),
      data,
    };
  }

  async getAllGenres(): Promise<genre[]> {
    const root = await getHtmlParser(this.baseUrl + "/tim-truyen");
    const genresRaw = root.querySelectorAll(
      "#ctl00_divRight .ModuleContent ul.nav li a"
    );
    let all_Genres: genre[] = [];
    genresRaw.forEach((item) => {
      if (
        !removeVietnameseAccent(item.innerText)
          .toLowerCase()
          .includes("tat ca the loai")
      ) {
        all_Genres.push({
          name: item.innerText,
          path: item.getAttribute("href")?.replace(this.baseUrl, "") ?? "",
          url: item.getAttribute("href") ?? "",
        });
      }
    });
    return all_Genres;
  }

  async search(keyword: string, page = 1): Promise<responseListComic> {
    return this.getListComic(
      this.baseUrl + `/tim-truyen?keyword=${keyword}&page=${page}`
    );
  }

  async getListLatestUpdate(page = 1): Promise<responseListComic> {
    return this.getListComic(this.baseUrl + `/tim-truyen?page=${page}`);
  }
  async getListComplete(page = 1): Promise<responseListComic> {
    return this.getListComic(this.baseUrl + `/truyen-full?page=${page}`);
  }
  async getListNew(page = 1): Promise<responseListComic> {
    return this.getListComic(
      this.baseUrl + `/truyen-full?page=${page}&status=-1&sort=15`
    );
  }
  async getListByGenre(genre: genre, page = 1): Promise<responseListComic> {
    return this.getListComic(this.baseUrl + `${genre.path}?page=${page}`);
  }
  async getDetailComic(comic: itemComic): Promise<responseDetailComic> {
    const root = await getHtmlParser(this.baseUrl + comic.href);
    const author =
      root
        .querySelectorAll("#item-detail li.author.row a")
        .map((au) => au.innerText.trim()) ?? [];
    let status: any = removeVietnameseAccent(
      root.querySelectorAll("#item-detail li.status.row p").pop()?.innerText ??
        ""
    ).toLowerCase();

    if (status === "dang tien hanh") status = "process";
    else if (status === "hoan thanh") status = "complete";
    else status = null;

    const genres = root
      .querySelectorAll("#item-detail li.kind.row a")
      .map((g) => ({
        name: g.innerText.trim(),
        url: g.getAttribute("href"),
        path: g.getAttribute("href")?.replace(this.baseUrl, ""),
      })) as genre[];

    const views = root
      .querySelectorAll("#item-detail .row")
      .find(
        (item) =>
          item.querySelector(".fa.fa-eye") ||
          removeVietnameseAccent(item.querySelector("p")?.innerText ?? "") ===
            "luot xem"
      )
      ?.querySelectorAll("p")
      .pop()?.innerText;

    const follows =
      root.querySelector("#item-detail .follow span b")?.innerText ?? "";

    const rate =
      root.querySelector(
        "#item-detail span[itemprop='aggregateRating'] span[itemprop='ratingValue']"
      )?.innerText +
      "/" +
      root.querySelector(
        "#item-detail span[itemprop='aggregateRating'] span[itemprop='bestRating']"
      )?.innerText;

    const rate_number = root.querySelector(
      "#item-detail span[itemprop='aggregateRating'] span[itemprop='ratingCount']"
    )?.innerText;

    const chapters = root
      .querySelectorAll("#nt_listchapter nav ul li")
      .map((chap) => {
        const chap_text = chap.querySelector("a")?.innerText.split(":") ?? [""];
        return {
          path: chap
            .querySelector("a")
            ?.getAttribute("href")
            ?.replace(this.baseUrl, ""),
          url: chap.querySelector("a")?.getAttribute("href"),
          title: chap_text.length > 2 ? chap_text.pop()?.trim() : "",
          chap_name: chap_text[0].toLowerCase().replace("chapter", "").trim(),
        };
      }) as chapter[];
    return {
      path: comic.href,
      url: this.baseUrl + comic.href,
      author,
      title: comic.title,
      status,
      genres,
      views,
      rate,
      rate_number,
      follows,
      chapters,
    };
  }
}
