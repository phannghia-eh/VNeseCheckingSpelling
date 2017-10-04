using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using Newtonsoft.Json.Linq;

namespace VietnameseSpelling.Controllers
{
    [Route("api/[controller]")]
    public class CheckSpellingController : Controller
    {
        private static string[] sRandom = new[]
        {
            "Quyên"
        };

        private static CheckPhrase Check = new CheckPhrase();

        [HttpGet("[action]")]
        public WordPhrase WordPhrases()
        {
            var rng = new Random();
            return new WordPhrase
            {
                Word = sRandom[rng.Next(sRandom.Length)],
                IsWord = true
            };
        }

        [HttpPost("[action]")]
        public WordPhrase GetWord()
        {
            WordPhrase ret = new WordPhrase();
            using (var ios = new StreamReader(Request.Body))
            {
                ret.Word = (new WordJson(ios.ReadToEnd())).Word;
                ret.IsWord = Check.IsCorrect(ret.Word);
            };
            return ret;
        }

        public class WordPhrase
        {
            public string Word { get; set; }
            public bool IsWord { get; set; }
        }

        public class WordJson
        {
            public string Word { get; set; }

            public WordJson(string json)
            {
                JObject jObj = JObject.Parse(json);
                JToken jToken = jObj;
                Word = (string)jToken["Word"];
            }
        }
    }

    public class Word
    {
        public string Rhyme { get; set; }
        public string Consonant { get; set; }
    }

    public class PatternWord
    {
        public string Rhyme { get; set; }
        public string[] Consonant { get; set; }
    }

    public class CheckPhrase
    {
        private PatternWord[] cRhyme;
        private string[] Consonant;
        public CheckPhrase()
        {
            using (var isRhyme = new StreamReader("./Data/Rhyme.csv"))
            {
                List<PatternWord> tcRhyme = new List<PatternWord>();
                while (!isRhyme.EndOfStream)
                {
                    var line = isRhyme.ReadLine();
                    string[] value = line.Split(",");
                    PatternWord temp = new PatternWord
                    {
                        Rhyme = value[0],
                        Consonant = new string[value.Length - 1]
                    };
                    for (int ii = 1; ii < value.Length; ii++)
                    {
                        temp.Consonant[ii - 1] = value[ii];
                    }
                    tcRhyme.Add(temp);
                }
                cRhyme = tcRhyme.ToArray();
            }
            using (var isConsonant = new StreamReader("./Data/Consonant.csv"))
            {
                var line = isConsonant.ReadLine();
                Consonant = line.Split(",");
            }
        }

        public bool IsCorrect(string word)
        {
            string cWord = word.ToUpper();
            Word checkRhyme = new Word()
            {
                Consonant = "",
                Rhyme = ""
            };
            foreach (var Cons in Consonant)
            {
                if ((cWord.IndexOf(Cons) == 0) &&
                    (checkRhyme.Consonant.Length < Cons.Length))
                {
                    checkRhyme.Consonant = Cons;
                }
            }
            checkRhyme.Rhyme = cWord.Substring(checkRhyme.Consonant.Length);

            PatternWord patternWord = new PatternWord();
            foreach (var rRhyme in cRhyme)
            {
                if (checkRhyme.Rhyme.Equals(rRhyme.Rhyme))
                {
                    patternWord = rRhyme;
                    break;
                }
            }
            if ((new List<string>(patternWord.Consonant)).IndexOf(checkRhyme.Consonant) != -1)
            {
                return true;
            }
            return false;
        }
    }
}