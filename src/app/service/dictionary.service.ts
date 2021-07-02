import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Language } from '../models/language.model';
/**
 * A yandex api végpontjait szolgálja ki
 * Mivel minden http.get metódus aszinkron, ezért az összes metódus aszinkron itt
 */
@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  constructor(private http: HttpClient) { }

  /*
  Ezzel a függvény visszatér az összes lehetséges nyelv fordítási párosokkal
  */
  getLangs() {

    return this.http.get<string[]>("https://dictionary.yandex.net/api/v1/dicservice.json/getLangs?key=dict.1.1.20210419T194047Z.188f64ab9ae4a412.cec238aea7aeaf26a8a28f73ebd2b02a543f79f3")
      
  }

  /**
   * 
   * @param word Ez a szó, aminek a másik nyelvi megfelelőjét keressük
   * @param translate Ez a nyelv fordítási páros
   * @returns A paraméterben megadott szó másik nyelven
   */
  translate(word: string, translate: string){
    return this.http.get<Language>("https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20210419T194047Z.188f64ab9ae4a412.cec238aea7aeaf26a8a28f73ebd2b02a543f79f3&lang="+translate+"&text="+word)
  }
}
