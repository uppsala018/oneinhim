import fsSync from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceRoot = path.join(root, "imports", "raw", "fathers");
const outputPath = path.join(root, "src", "content", "fathers-library.json");

const sharedTracks = ["catholic", "orthodox"];

function sourceFilesByPrefix(prefix) {
  return fsSync
    .readdirSync(sourceRoot)
    .filter((fileName) => fileName.startsWith(prefix) && fileName.endsWith(".htm"))
    .sort();
}

function sourceFilesFromIndex(prefix, indexFileName, excludedIds = []) {
  const html = fsSync.readFileSync(path.join(sourceRoot, indexFileName), "utf8");
  const excluded = new Set(excludedIds);
  const seen = new Set();
  const fileNames = [];
  const linkRegex = /href="\.\.\/fathers\/(\d+\.htm)"/g;
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    const id = match[1];

    if (seen.has(id) || excluded.has(id)) {
      continue;
    }

    seen.add(id);
    fileNames.push(`${prefix}${id}`);
  }

  return fileNames;
}

const libraryConfig = [
  {
    slug: "ignatius-antioch",
    name: "Ignatius of Antioch",
    era: "c. 35-108",
    region: "Antioch and Asia Minor",
    tradition: "Apostolic Father",
    stream: "shared",
    studyTracks: sharedTracks,
    summary:
      "Ignatius wrote on church unity, the bishop, the Eucharist, and martyrdom while travelling under guard to Rome.",
    bio:
      "Ignatius stands close to the apostolic age and gives one of the clearest early witnesses to episcopal order, sacramental worship, and the Church's visible unity. His surviving letters were written on the road to martyrdom.",
    themes: ["unity", "bishop", "eucharist", "martyrdom"],
    works: [
      makeSingleWork("letter-to-the-ephesians", "The Epistle of Ignatius to the Ephesians", "ignatius-ephesians.html", "0104", "c. 107", "A sustained appeal to unity, disciplined church life, and perseverance in Christ."),
      makeSingleWork("letter-to-the-magnesians", "The Epistle of Ignatius to the Magnesians", "ignatius-magnesians.html", "0105", "c. 107", "Ignatius urges harmony around the bishop and warns against divided teaching."),
      makeSingleWork("letter-to-the-trallians", "The Epistle of Ignatius to the Trallians", "ignatius-trallians.html", "0106", "c. 107", "A call to stability, humility, and resistance to false doctrine."),
      makeSingleWork("letter-to-the-romans", "The Epistle of Ignatius to the Romans", "ignatius-romans.html", "0107", "c. 107", "Ignatius pleads that his martyrdom not be prevented and describes his longing for Christ."),
      makeSingleWork("letter-to-the-philadelphians", "The Epistle of Ignatius to the Philadelphians", "ignatius-philadelphians.html", "0108", "c. 107", "A warning against schism with a repeated emphasis on unity at the altar."),
      makeSingleWork("letter-to-the-smyrnaeans", "The Epistle of Ignatius to the Smyrnaeans", "ignatius-smyrnaeans.html", "0109", "c. 107", "A major witness to the reality of Christ's flesh and the Eucharist against docetism."),
      makeSingleWork("letter-to-polycarp", "The Epistle of Ignatius to Polycarp", "ignatius-polycarp.html", "0110", "c. 107", "Pastoral counsel for Polycarp on steadfastness, discipline, and endurance."),
    ],
  },
  {
    slug: "clement-rome",
    name: "Clement of Rome",
    era: "late 1st century",
    region: "Rome",
    tradition: "Apostolic Father",
    stream: "shared",
    studyTracks: sharedTracks,
    summary:
      "Clement's letters are among the earliest non-New Testament Christian texts and address order, repentance, and perseverance.",
    bio:
      "Clement's surviving Corinthian correspondence shows the Roman church speaking with moral authority at the end of the first century. The letters are vital for early church order, apostolic continuity, and practical holiness.",
    themes: ["church-order", "repentance", "perseverance", "apostolic-succession"],
    works: [
      makeSingleWork("first-letter-to-the-corinthians", "First Letter to the Corinthians", "clement-1.html", "1010", "late 1st century", "A long appeal for repentance, humility, peace, and rightful ministry in the church."),
      makeSingleWork("second-letter-to-the-corinthians", "Second Letter to the Corinthians", "clement-2.html", "1011", "2nd century", "An early homiletic exhortation on repentance, obedience, and life in Christ."),
    ],
  },
  {
    slug: "polycarp-smyrna",
    name: "Polycarp of Smyrna",
    era: "c. 69-155",
    region: "Smyrna",
    tradition: "Apostolic Father",
    stream: "shared",
    studyTracks: sharedTracks,
    summary:
      "Polycarp links the apostolic age to the mid-second century through pastoral exhortation and martyr testimony.",
    bio:
      "Polycarp was a major bishop of Smyrna, associated with the apostolic generation and remembered both for his letter to the Philippians and for his martyrdom. His witness joins practical holiness to steadfast confession.",
    themes: ["pastoral-care", "martyrdom", "steadfastness", "apostolic-witness"],
    works: [
      makeSingleWork("letter-to-the-philippians", "The Epistle of Polycarp to the Philippians", "polycarp-philippians.html", "0136", "2nd century", "Pastoral exhortation on righteousness, endurance, and fidelity to apostolic teaching."),
      makeSingleWork("martyrdom-of-polycarp", "The Martyrdom of Polycarp", "martyrdom-polycarp.html", "0102", "mid-2nd century", "A classic martyr act describing Polycarp's confession, death, and early Christian remembrance."),
    ],
  },
  {
    slug: "didache",
    name: "The Didache",
    era: "1st-2nd century",
    region: "Eastern Mediterranean",
    tradition: "Apostolic Writings",
    stream: "shared",
    studyTracks: sharedTracks,
    summary:
      "The Didache preserves an early manual of Christian morals, baptism, Eucharist, ministry, and eschatological watchfulness.",
    bio:
      "The Didache is not a personal letter but an early church manual. It is one of the clearest windows into practical Christian catechesis, worship, and church discipline near the apostolic period.",
    themes: ["catechesis", "baptism", "eucharist", "church-order"],
    works: [
      makeSingleWork("didache", "The Didache", "didache.html", "0714", "1st-2nd century", "An early church manual on the two ways, sacramental life, ministry, and readiness for the Lord's coming."),
    ],
  },
  {
    slug: "barnabas",
    name: "The Epistle of Barnabas",
    era: "1st-2nd century",
    region: "Eastern Mediterranean",
    tradition: "Apostolic Writings",
    stream: "shared",
    studyTracks: sharedTracks,
    summary:
      "Barnabas presents a strongly typological reading of Scripture and a moral contrast between the way of light and the way of darkness.",
    bio:
      "The Epistle of Barnabas is an early Christian tract that reads the Old Testament through Christ and develops a practical moral theology of light and darkness. It became an important witness to early Christian exegesis.",
    themes: ["scripture", "typology", "moral-teaching", "covenant"],
    works: [
      makeSingleWork("epistle-of-barnabas", "The Epistle of Barnabas", "barnabas.html", "0124", "1st-2nd century", "An early Christian exposition of Scripture and the way of light."),
    ],
  },
  {
    slug: "mathetes-diognetus",
    name: "Mathetes to Diognetus",
    era: "2nd century",
    region: "Greek-speaking Church",
    tradition: "Early Christian Apology",
    stream: "shared",
    studyTracks: sharedTracks,
    summary:
      "The Letter to Diognetus offers one of the most memorable early descriptions of Christian life in the world.",
    bio:
      "The anonymous author traditionally called Mathetes writes to explain Christian worship, conduct, and hope. The work is especially prized for its concise apologetic portrait of Christians as the soul within the world.",
    themes: ["apologetics", "christian-life", "incarnation", "mission"],
    works: [
      makeSingleWork("letter-to-diognetus", "The Epistle of Mathetes to Diognetus", "diognetus.html", "0101", "2nd century", "A concise apology on Christian life, worship, and the revelation of the Word."),
    ],
  },
  {
    slug: "justin-martyr",
    name: "Justin Martyr",
    era: "c. 100-165",
    region: "Samaria and Rome",
    tradition: "Early Christian Apologist",
    stream: "shared",
    studyTracks: sharedTracks,
    summary:
      "Justin explained Christianity to the Roman world and preserved one of the church's earliest detailed descriptions of Christian worship.",
    bio:
      "Justin's writings connect Christian doctrine with philosophy while grounding the faith in Christ, prophecy, and public worship. His works are especially important for second-century liturgy and apologetics.",
    themes: ["apologetics", "liturgy", "reason", "prophecy"],
    works: [
      makeSingleWork("first-apology", "The First Apology of Justin", "justin-first-apology.html", "0126", "c. 155-157", "A formal defense of Christian worship, doctrine, and moral life addressed to Roman authorities."),
    ],
  },
  {
    slug: "irenaeus-lyon",
    name: "Irenaeus of Lyon",
    era: "c. 130-202",
    region: "Smyrna, Rome, and Lyon",
    tradition: "Ante-Nicene Father",
    stream: "shared",
    studyTracks: sharedTracks,
    summary:
      "Irenaeus defended apostolic faith against Gnostic systems and gave one of the earliest large-scale accounts of Scripture, the rule of faith, succession, and recapitulation in Christ.",
    bio:
      "Irenaeus was bishop of Lyon and a major second-century theologian. He links Asia Minor, Rome, and Gaul, and is especially important for his appeal to apostolic teaching, Scripture, and the Church's public rule of faith against Gnostic reinterpretation.",
    themes: ["apostolic-succession", "rule-of-faith", "gnosticism", "recapitulation", "scripture"],
    works: [
      makeSeriesWork(
        "against-heresies",
        "Against Heresies",
        sourceFilesByPrefix("irenaeus-against-heresies-"),
        "0103",
        "c. 180",
        "A five-book refutation of Gnostic systems and a positive defense of apostolic Christian teaching, creation, incarnation, Scripture, and salvation in Christ.",
      ),
    ],
  },
  {
    slug: "tertullian",
    name: "Tertullian",
    era: "c. 155-220",
    region: "Carthage",
    tradition: "Latin Ante-Nicene Father",
    stream: "shared",
    studyTracks: sharedTracks,
    summary:
      "Tertullian was an early Latin theologian and apologist whose writings shaped Christian vocabulary on apologetics, baptism, prayer, Christology, resurrection, and the Trinity.",
    bio:
      "Tertullian wrote from North Africa at the turn of the third century. His works are vigorous, legal-minded, and polemical, making him essential for studying early Latin Christianity, martyr witness, heresy, sacramental practice, and the Church's developing theological language.",
    themes: ["apologetics", "baptism", "prayer", "trinity", "christology", "resurrection"],
    works: [
      makeSingleWork("apology", "Apology", "tertullian-apology.html", "0301", "c. 197", "A defense of Christians before Roman authorities, arguing against popular slanders and for the moral and public integrity of Christian life."),
      makeSingleWork("prescription-against-heretics", "Prescription against Heretics", "tertullian-prescription-against-heretics.html", "0311", "c. 200", "A classic argument that apostolic teaching and public church succession expose the novelty of heretical claims."),
      makeSingleWork("on-baptism", "On Baptism", "tertullian-on-baptism.html", "0321", "late 2nd-early 3rd century", "An early Latin treatise on baptism, water, faith, preparation, and the Church's sacramental practice."),
      makeSingleWork("on-prayer", "On Prayer", "tertullian-on-prayer.html", "0322", "late 2nd-early 3rd century", "A practical and theological exposition of the Lord's Prayer and Christian discipline in prayer."),
      makeSingleWork("on-the-flesh-of-christ", "On the Flesh of Christ", "tertullian-on-the-flesh-of-christ.html", "0315", "early 3rd century", "A defense of the real incarnation and true flesh of Christ against docetic and speculative Christologies."),
      makeSingleWork("on-the-resurrection-of-the-flesh", "On the Resurrection of the Flesh", "tertullian-on-the-resurrection-of-the-flesh.html", "0316", "early 3rd century", "A substantial defense of bodily resurrection and the goodness of embodied salvation."),
      makeSingleWork("against-praxeas", "Against Praxeas", "tertullian-against-praxeas.html", "0317", "early 3rd century", "A major early Latin witness to Trinitarian language against modalism, including Tertullian's distinction between person and substance."),
    ],
  },
  {
    slug: "origen",
    name: "Origen",
    era: "c. 185-254",
    region: "Alexandria and Caesarea",
    tradition: "Greek Ante-Nicene Father",
    stream: "shared",
    studyTracks: sharedTracks,
    summary:
      "Origen was one of the most influential early Christian biblical scholars, apologists, and speculative theologians, especially important for Scripture, prayer, Christology, and the spiritual interpretation of the Bible.",
    bio:
      "Origen taught in Alexandria and Caesarea and produced an enormous body of biblical and theological work. His legacy is complex: the Church received much from his exegesis, ascetic seriousness, and apologetics while later rejecting some Origenist speculations. He should be studied carefully as a major but not uncontroversial patristic witness.",
    themes: ["scripture", "apologetics", "spiritual-exegesis", "christology", "prayer", "controversy"],
    works: [
      makeSeriesWork(
        "de-principiis",
        "De Principiis",
        [
          "origen-de-principiis-preface.html",
          "origen-de-principiis-book-1.html",
          "origen-de-principiis-book-2.html",
          "origen-de-principiis-book-3.html",
          "origen-de-principiis-book-4.html",
        ],
        "0412",
        "early 3rd century",
        "Origen's major early systematic work on God, creation, Scripture, freedom, rational creatures, and Christian doctrine.",
      ),
      makeSeriesWork(
        "contra-celsum",
        "Contra Celsum",
        [
          "origen-contra-celsum-book-1.html",
          "origen-contra-celsum-book-2.html",
          "origen-contra-celsum-book-3.html",
          "origen-contra-celsum-book-4.html",
          "origen-contra-celsum-book-5.html",
          "origen-contra-celsum-book-6.html",
          "origen-contra-celsum-book-7.html",
          "origen-contra-celsum-book-8.html",
        ],
        "0416",
        "c. 248",
        "A detailed Christian response to the pagan critic Celsus, defending Christ, Scripture, prophecy, worship, and Christian moral life.",
      ),
      makeSeriesWork(
        "commentary-on-john",
        "Commentary on the Gospel of John",
        [
          "origen-commentary-john-book-1.html",
          "origen-commentary-john-book-2.html",
          "origen-commentary-john-book-4.html",
          "origen-commentary-john-book-5.html",
          "origen-commentary-john-book-6.html",
          "origen-commentary-john-book-10.html",
        ],
        "1015",
        "3rd century",
        "A major surviving biblical commentary on John's Gospel, showing Origen's theological and spiritual reading of Scripture.",
      ),
    ],
  },
  {
    slug: "cyprian-carthage",
    name: "Cyprian of Carthage",
    era: "c. 200-258",
    region: "Carthage",
    tradition: "Latin Ante-Nicene Father",
    stream: "shared",
    studyTracks: sharedTracks,
    summary:
      "Cyprian was bishop of Carthage during persecution and controversy, writing with lasting influence on church unity, episcopal order, repentance, martyrdom, prayer, and Christian discipline.",
    bio:
      "Cyprian led the church in Carthage through plague, persecution, schism, and disputes over the lapsed. His writings are essential for studying early Latin ecclesiology, pastoral discipline, martyr theology, and the concrete life of the third-century Church.",
    themes: ["church-unity", "episcopacy", "martyrdom", "repentance", "prayer", "pastoral-discipline"],
    works: [
      makeSingleWork("on-the-unity-of-the-church", "On the Unity of the Church", "cyprian-on-unity.html", "050701", "c. 251", "A major treatise on the unity of the Church, episcopal communion, schism, and the visible bonds of Christian fellowship."),
      makeSingleWork("on-the-dress-of-virgins", "On the Dress of Virgins", "cyprian-on-dress-of-virgins.html", "050702", "3rd century", "A pastoral exhortation on consecrated life, modesty, discipline, and spiritual integrity."),
      makeSingleWork("on-the-lapsed", "On the Lapsed", "cyprian-on-the-lapsed.html", "050703", "c. 251", "Cyprian's pastoral treatment of Christians who denied the faith under persecution and sought restoration."),
      makeSingleWork("on-the-lords-prayer", "On the Lord's Prayer", "cyprian-on-the-lords-prayer.html", "050704", "3rd century", "A theological and pastoral exposition of the prayer taught by Christ."),
      makeSingleWork("on-mortality", "On Mortality", "cyprian-on-mortality.html", "050707", "c. 252", "A Christian response to plague, death, hope, and the discipline of faith under suffering."),
      makeSingleWork("on-works-and-alms", "On Works and Alms", "cyprian-on-works-and-alms.html", "050708", "3rd century", "A call to mercy, generosity, repentance, and active love in Christian life."),
      makeSingleWork("on-patience", "On Patience", "cyprian-on-patience.html", "050709", "3rd century", "A meditation on patience as a mark of Christian endurance and imitation of God."),
      makeSingleWork("exhortation-to-martyrdom", "Exhortation to Martyrdom", "cyprian-exhortation-to-martyrdom.html", "050711", "3rd century", "A scriptural and pastoral preparation for confession, endurance, and martyr witness."),
    ],
  },
  {
    slug: "athanasius",
    name: "Athanasius",
    era: "c. 296-373",
    region: "Alexandria",
    tradition: "Nicene Father",
    stream: "shared",
    studyTracks: sharedTracks,
    summary:
      "Athanasius defended the full deity of Christ and wrote one of the church's classic explanations of the Incarnation.",
    bio:
      "As bishop of Alexandria, Athanasius became the defining anti-Arian voice of the fourth century. His writings tie salvation, worship, and Scripture together around the claim that the Son is truly God and truly man.",
    themes: ["incarnation", "nicene-faith", "salvation", "scripture"],
    works: [
      makeSingleWork("on-the-incarnation", "On the Incarnation of the Word", "athanasius-incarnation.html", "2802", "4th century", "A classic account of why the Word became flesh and how Christ restores humanity."),
    ],
  },
  {
    slug: "basil-great",
    name: "Basil the Great",
    era: "c. 329-379",
    region: "Cappadocia",
    tradition: "Cappadocian Father",
    stream: "orthodox",
    studyTracks: ["orthodox", "catholic"],
    summary:
      "Basil is one of the central Cappadocian fathers and a major voice on the Trinity, ascetic life, and the Holy Spirit.",
    bio:
      "Basil the Great is foundational for Eastern Christian theology, liturgical memory, and monastic formation. He is especially important for Orthodox study, but he also stands as a major saint and doctor in the Catholic tradition.",
    themes: ["trinity", "holy-spirit", "asceticism", "cappadocian"],
    works: [
      makeSingleWork("on-the-holy-spirit", "On the Holy Spirit", "basil-holy-spirit.html", "3203", "4th century", "A major defense of the divinity and worship of the Holy Spirit in Trinitarian theology."),
    ],
  },
  {
    slug: "gregory-nazianzen",
    name: "Gregory Nazianzen",
    era: "c. 329-390",
    region: "Cappadocia and Constantinople",
    tradition: "Cappadocian Father",
    stream: "orthodox",
    studyTracks: ["orthodox", "catholic"],
    summary:
      "Gregory Nazianzen is one of the great Cappadocian theologians, especially revered for his Trinitarian preaching.",
    bio:
      "Gregory Nazianzen, often called 'the Theologian' in the East, is central to Orthodox doctrinal study and remains a major patristic authority for Catholic theology as well. His theological orations are among the classic texts on the Trinity.",
    themes: ["trinity", "theology", "orations", "cappadocian"],
    works: [
      makeSeriesWork(
        "theological-orations",
        "Theological Orations",
        [
          "gregory-nazianzen-oration-27.html",
          "gregory-nazianzen-oration-28.html",
          "gregory-nazianzen-oration-29.html",
          "gregory-nazianzen-oration-30.html",
          "gregory-nazianzen-oration-31.html",
        ],
        "310227",
        "4th century",
        "Gregory's classic five orations on the right manner of theology and the Trinitarian mystery.",
      ),
    ],
  },
  {
    slug: "gregory-nyssa",
    name: "Gregory of Nyssa",
    era: "c. 335-395",
    region: "Cappadocia",
    tradition: "Cappadocian Father",
    stream: "orthodox",
    studyTracks: ["orthodox", "catholic"],
    summary:
      "Gregory of Nyssa is one of the great Cappadocian theologians, known for Trinitarian theology, theological anthropology, spiritual ascent, and profound reflection on resurrection and the Christian life.",
    bio:
      "Gregory of Nyssa, brother of Basil the Great and friend of Gregory Nazianzen, helped shape Nicene and Cappadocian theology. His writings are especially important for Orthodox and Catholic study of the Trinity, creation, the image of God, ascetic life, resurrection, and the soul's movement toward God.",
    themes: ["trinity", "cappadocian", "image-of-god", "resurrection", "asceticism", "spiritual-ascent"],
    works: [
      makeSingleWork("the-great-catechism", "The Great Catechism", "gregory-nyssa-great-catechism.html", "2908", "4th century", "A compact doctrinal work on creation, fall, incarnation, redemption, baptism, and Eucharist."),
      makeSingleWork("on-the-making-of-man", "On the Making of Man", "gregory-nyssa-making-of-man.html", "2914", "4th century", "A theological anthropology on creation, the image of God, human nature, soul, body, and vocation."),
      makeSingleWork("on-the-soul-and-the-resurrection", "On the Soul and the Resurrection", "gregory-nyssa-soul-resurrection.html", "2915", "4th century", "A dialogue with Macrina on death, the soul, purification, hope, and resurrection."),
      makeSingleWork("on-not-three-gods", "On Not Three Gods", "gregory-nyssa-not-three-gods.html", "2905", "4th century", "A concise Trinitarian argument explaining why Christians confess Father, Son, and Spirit without teaching three gods."),
      makeSingleWork("on-the-holy-spirit", "On the Holy Spirit, Against the Macedonians", "gregory-nyssa-holy-spirit.html", "2903", "4th century", "A defense of the Holy Spirit's divinity against Macedonian teaching."),
      makeSingleWork("on-virginity", "On Virginity", "gregory-nyssa-virginity.html", "2907", "4th century", "An ascetical treatise on purity, detachment, and the undivided pursuit of God."),
      makeSingleWork("on-pilgrimages", "On Pilgrimages", "gregory-nyssa-pilgrimages.html", "2913", "4th century", "A pastoral reflection on pilgrimage, holiness, and the dangers of confusing travel with transformation."),
      makeSingleWork("on-the-baptism-of-christ", "On the Baptism of Christ", "gregory-nyssa-baptism-of-christ.html", "2910", "4th century", "A liturgical sermon for the feast of the Lord's baptism and the mystery of illumination."),
    ],
  },
  {
    slug: "john-chrysostom",
    name: "John Chrysostom",
    era: "c. 347-407",
    region: "Antioch and Constantinople",
    tradition: "Golden-Mouthed Father",
    stream: "orthodox",
    studyTracks: ["orthodox", "catholic"],
    summary:
      "Chrysostom is one of the most influential Greek fathers, known for preaching, pastoral theology, and moral instruction.",
    bio:
      "John Chrysostom is central to Orthodox liturgical and pastoral memory and remains deeply important in Catholic patristic reading. His writings join scriptural preaching with direct pastoral instruction and moral seriousness.",
    themes: ["preaching", "priesthood", "pastoral-care", "scripture"],
    works: [
      makeSeriesWork(
        "on-the-priesthood",
        "On the Priesthood",
        [
          "chrysostom-priesthood-1.html",
          "chrysostom-priesthood-2.html",
          "chrysostom-priesthood-3.html",
          "chrysostom-priesthood-4.html",
          "chrysostom-priesthood-5.html",
          "chrysostom-priesthood-6.html",
        ],
        "19221",
        "4th century",
        "A major pastoral and theological work on ministry, responsibility, and the burden of priestly office.",
      ),
    ],
  },
  {
    slug: "cyril-jerusalem",
    name: "Cyril of Jerusalem",
    era: "c. 313-386",
    region: "Jerusalem",
    tradition: "Catechetical Father",
    stream: "shared",
    studyTracks: sharedTracks,
    summary:
      "Cyril's catechetical lectures are among the church's most important early instructions on baptism, creed, sacrament, and worship.",
    bio:
      "Cyril of Jerusalem is foundational for catechesis, liturgy, and sacramental theology. His lectures are especially valuable for Orthodox and Catholic readers because they show how fourth-century Jerusalem formed converts for baptism and Eucharistic life.",
    themes: ["catechesis", "baptism", "creed", "liturgy"],
    works: [
      makeSeriesWork(
        "catechetical-lectures",
        "Catechetical Lectures",
        [
          "cyril-catechetical-310100.html",
          "cyril-catechetical-310101.html",
          "cyril-catechetical-310102.html",
          "cyril-catechetical-310103.html",
          "cyril-catechetical-310104.html",
          "cyril-catechetical-310105.html",
          "cyril-catechetical-310106.html",
          "cyril-catechetical-310107.html",
          "cyril-catechetical-310108.html",
          "cyril-catechetical-310109.html",
          "cyril-catechetical-310110.html",
          "cyril-catechetical-310111.html",
          "cyril-catechetical-310112.html",
          "cyril-catechetical-310113.html",
          "cyril-catechetical-310114.html",
          "cyril-catechetical-310115.html",
          "cyril-catechetical-310116.html",
          "cyril-catechetical-310117.html",
          "cyril-catechetical-310118.html",
          "cyril-catechetical-310119.html",
          "cyril-catechetical-310120.html",
          "cyril-catechetical-310121.html",
          "cyril-catechetical-310122.html",
          "cyril-catechetical-310123.html",
        ],
        "310100",
        "4th century",
        "A large catechetical corpus on preparation for baptism, the creed, the sacraments, and the Christian life.",
      ),
    ],
  },
  {
    slug: "augustine-hippo",
    name: "Augustine of Hippo",
    era: "354-430",
    region: "North Africa",
    tradition: "Latin Father",
    stream: "catholic",
    studyTracks: ["catholic", "protestant"],
    summary:
      "Augustine shaped Western Christianity through biblical reflection, confession, and theological synthesis.",
    bio:
      "Augustine is one of the most important Western church fathers. His autobiographical, pastoral, and doctrinal works became central to Catholic theology and remained deeply influential for many Protestant readers as well.",
    themes: ["conversion", "grace", "memory", "prayer"],
    works: [
      makeSeriesWork(
        "confessions",
        "The Confessions",
        [
          "augustine-confessions-110101.html",
          "augustine-confessions-110102.html",
          "augustine-confessions-110103.html",
          "augustine-confessions-110104.html",
          "augustine-confessions-110105.html",
          "augustine-confessions-110106.html",
          "augustine-confessions-110107.html",
          "augustine-confessions-110108.html",
          "augustine-confessions-110109.html",
          "augustine-confessions-110110.html",
          "augustine-confessions-110111.html",
          "augustine-confessions-110112.html",
          "augustine-confessions-110113.html",
        ],
        "110101",
        "397-400",
        "Augustine's autobiographical and theological masterwork on memory, conversion, grace, and the restlessness of the heart before God.",
      ),
    ],
  },
  {
    slug: "jerome",
    name: "Jerome",
    era: "c. 347-420",
    region: "Stridon, Rome, and Bethlehem",
    tradition: "Latin Father and Doctor",
    stream: "catholic",
    studyTracks: ["catholic", "orthodox", "protestant"],
    summary:
      "Jerome was a major biblical scholar, translator, ascetic writer, and Latin Father, best known for his work on Scripture, the Vulgate, monastic life, and polemical theology.",
    bio:
      "Jerome's scholarship joined Hebrew and Greek learning with intense ascetic discipline and pastoral correspondence. His writings are central for studying biblical translation, the Latin reception of Scripture, monastic ideals, Marian doctrine, controversy, and the memory of earlier Christian writers.",
    themes: ["scripture", "translation", "asceticism", "monasticism", "mary", "church-history"],
    works: [
      makeSeriesWork("letters", "Letters", sourceFilesFromIndex("jerome-letters-", "jerome-letters.html", ["3001.htm"]), "3001", "374-420", "Jerome's wide-ranging correspondence on Scripture, translation, ascetic life, controversy, pastoral counsel, and relations with Augustine and other church leaders."),
      makeSingleWork("prefaces", "Prefaces", "jerome-prefaces.html", "3002", "late 4th-early 5th century", "Jerome's biblical prefaces, important for understanding his approach to translation, canon, and the Latin Bible."),
      makeSingleWork("perpetual-virginity-of-blessed-mary", "The Perpetual Virginity of Blessed Mary", "jerome-perpetual-virginity-mary.html", "3007", "383", "Jerome's defense of Mary's perpetual virginity against Helvidius."),
      makeSeriesWork("against-jovinianus", "Against Jovinianus", sourceFilesFromIndex("jerome-against-jovinianus-", "jerome-against-jovinianus.html", ["3009.htm"]), "3009", "393", "A two-book polemical work on asceticism, marriage, virginity, and Christian discipline."),
      makeSingleWork("against-vigilantius", "Against Vigilantius", "jerome-against-vigilantius.html", "3010", "406", "A polemical defense of relics, vigils, ascetic discipline, and monastic devotion."),
      makeSeriesWork("against-the-pelagians", "Against the Pelagians", sourceFilesFromIndex("jerome-against-pelagians-", "jerome-against-pelagians.html", ["3011.htm"]), "3011", "415", "A three-book dialogue against Pelagian teaching on grace, sin, freedom, and Christian life."),
      makeSingleWork("life-of-hilarion", "The Life of St. Hilarion", "jerome-life-hilarion.html", "3003", "390", "A monastic biography presenting Hilarion as a model of ascetic holiness and spiritual warfare."),
      makeSingleWork("life-of-malchus", "The Life of Malchus, the Captive Monk", "jerome-life-malchus.html", "3006", "390", "A short ascetic narrative on captivity, chastity, and monastic perseverance."),
      makeSingleWork("life-of-paulus-the-first-hermit", "The Life of Paulus the First Hermit", "jerome-life-paul-first-hermit.html", "3008", "late 4th century", "Jerome's account of Paul the Hermit and early desert asceticism."),
      makeSingleWork("de-viris-illustribus", "De Viris Illustribus", "jerome-de-viris-illustribus.html", "2708", "392", "A catalogue of illustrious Christian writers and one of the key early sources for patristic literary history."),
    ],
  },
  {
    slug: "ambrose",
    name: "Ambrose",
    era: "c. 340-397",
    region: "Milan",
    tradition: "Latin Father and Doctor",
    stream: "catholic",
    studyTracks: ["catholic", "orthodox", "protestant"],
    summary:
      "Ambrose of Milan was a bishop, preacher, theologian, and pastor whose writings shaped Western teaching on the Trinity, sacraments, repentance, clerical life, ascetic devotion, and public Christian leadership.",
    bio:
      "Ambrose stands at the heart of fourth-century Latin Christianity. As bishop of Milan he instructed Augustine, opposed Arian pressure, shaped sacramental catechesis, and gave the Western Church enduring works on faith, the Holy Spirit, repentance, ministry, and holy living.",
    themes: ["trinity", "holy-spirit", "sacraments", "repentance", "pastoral-leadership", "asceticism"],
    works: [
      makeSeriesWork("on-the-christian-faith", "On the Christian Faith", sourceFilesFromIndex("ambrose-on-christian-faith-", "ambrose-on-christian-faith.html", ["3404.htm"]), "3404", "4th century", "A major Nicene defense of the Son's divinity against Arian teaching."),
      makeSeriesWork("on-the-holy-spirit", "On the Holy Spirit", sourceFilesFromIndex("ambrose-on-holy-spirit-", "ambrose-on-holy-spirit.html", ["3402.htm"]), "3402", "4th century", "Ambrose's defense of the divinity and worship of the Holy Spirit."),
      makeSingleWork("on-the-mysteries", "On the Mysteries", "ambrose-on-mysteries.html", "3405", "4th century", "A classic mystagogical explanation of baptism, chrismation, Eucharist, and sacramental initiation."),
      makeSeriesWork("on-repentance", "On Repentance", sourceFilesFromIndex("ambrose-on-repentance-", "ambrose-on-repentance.html", ["3406.htm"]), "3406", "4th century", "A pastoral and doctrinal work on sin, mercy, penitence, and restoration."),
      makeSeriesWork("on-the-duties-of-the-clergy", "On the Duties of the Clergy", sourceFilesFromIndex("ambrose-on-duties-clergy-", "ambrose-on-duties-clergy.html", ["3401.htm"]), "3401", "4th century", "A major pastoral ethics text for clergy on virtue, prudence, justice, courage, and ministry."),
      makeSeriesWork("concerning-virgins", "Concerning Virgins", sourceFilesFromIndex("ambrose-concerning-virgins-", "ambrose-concerning-virgins.html", ["3407.htm"]), "3407", "4th century", "Ambrose's ascetical teaching on consecrated virginity and holiness."),
      makeSingleWork("concerning-widows", "Concerning Widows", "ambrose-concerning-widows.html", "3408", "4th century", "A pastoral work on widowhood, continence, faithfulness, and Christian vocation."),
      makeSeriesWork("on-the-death-of-satyrus", "On the Death of Satyrus", sourceFilesFromIndex("ambrose-death-satyrus-", "ambrose-death-satyrus.html", ["3403.htm"]), "3403", "4th century", "Ambrose's funeral orations for his brother, reflecting on grief, resurrection, and Christian hope."),
      makeSeriesWork("letters", "Letters", sourceFilesFromIndex("ambrose-letters-", "ambrose-letters.html", ["3409.htm"]), "3409", "4th century", "Selected letters showing Ambrose's pastoral, doctrinal, and public leadership."),
    ],
  },
  {
    slug: "leo-great",
    name: "Leo the Great",
    era: "c. 400-461",
    region: "Rome",
    tradition: "Latin Father and Doctor",
    stream: "catholic",
    studyTracks: ["catholic", "orthodox", "protestant"],
    summary:
      "Leo the Great was bishop of Rome, a major preacher, and a defining Christological voice at Chalcedon through his Tome and wider correspondence.",
    bio:
      "Leo's sermons and letters show fifth-century pastoral theology, liturgical preaching, papal leadership, and Christological precision. His Tome to Flavian became central to Chalcedon's confession of Christ as one person in two natures.",
    themes: ["christology", "chalcedon", "preaching", "papacy", "liturgy", "pastoral-care"],
    works: [
      makeSeriesWork("sermons", "Sermons", sourceFilesFromIndex("leo-sermons-", "leo-sermons.html", ["3603.htm"]), "3603", "5th century", "Leo's liturgical and pastoral sermons on feasts, fasting, almsgiving, Christology, and Christian life."),
      makeSeriesWork("letters", "Letters", sourceFilesFromIndex("leo-letters-", "leo-letters.html", ["3604.htm"]), "3604", "5th century", "Leo's ecclesiastical and doctrinal correspondence, including Letter 28, the Tome to Flavian."),
    ],
  },
  {
    slug: "john-damascus",
    name: "John of Damascus",
    era: "c. 675-749",
    region: "Damascus and Mar Saba",
    tradition: "Eastern Father and Doctor",
    stream: "orthodox",
    studyTracks: ["orthodox", "catholic"],
    summary:
      "John of Damascus synthesized patristic theology for the Byzantine tradition and is especially important for Orthodox doctrine, Christology, icons, sacraments, and the confession of the faith.",
    bio:
      "John of Damascus wrote near the end of the patristic age. His Exposition of the Orthodox Faith gathers earlier Greek theology into a structured account of God, creation, Christ, salvation, sacraments, icons, and the Christian life.",
    themes: ["orthodox-faith", "trinity", "christology", "icons", "sacraments", "patristic-synthesis"],
    works: [
      makeSeriesWork("exposition-of-the-orthodox-faith", "Exposition of the Orthodox Faith", sourceFilesFromIndex("john-damascus-exposition-faith-", "john-damascus-exposition-faith.html", ["3304.htm"]), "3304", "8th century", "A structured synthesis of Greek patristic doctrine on God, creation, Christ, worship, sacraments, and the Christian confession."),
    ],
  },
];

function makeSingleWork(slug, title, fileName, sourceId, yearLabel, summary) {
  return {
    slug,
    title,
    sourceId,
    yearLabel,
    summary,
    fileNames: [fileName],
  };
}

function makeSeriesWork(slug, title, fileNames, sourceId, yearLabel, summary) {
  return {
    slug,
    title,
    sourceId,
    yearLabel,
    summary,
    fileNames,
  };
}

function decodeEntities(value) {
  return value
    .replace(/&#160;|&nbsp;/g, " ")
    .replace(/&#151;|&mdash;/g, " - ")
    .replace(/&#150;|&ndash;/g, " - ")
    .replace(/&hellip;/g, "...")
    .replace(/&lsquo;|&#8216;/g, "'")
    .replace(/&rsquo;|&#8217;/g, "'")
    .replace(/&ldquo;|&#8220;/g, '"')
    .replace(/&rdquo;|&#8221;/g, '"')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&ouml;/g, "o")
    .replace(/&aelig;/g, "ae")
    .replace(/&AElig;/g, "AE")
    .replace(/&oelig;/g, "oe")
    .replace(/&OElig;/g, "OE")
    .replace(/&eacute;/g, "e")
    .replace(/&uuml;/g, "u")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function stripTags(value) {
  return decodeEntities(
    value
      .replace(/<sup[^>]*>.*?<\/sup>/gis, "")
      .replace(/<span class="stiki"[^>]*>.*?<\/span>/gis, " ")
      .replace(/<span class="fisk"[^>]*>.*?<\/span>/gis, " ")
      .replace(/<span class="prefisk"[^>]*>.*?<\/span>/gis, "$&")
      .replace(/<span[^>]*>.*?<\/span>/gis, (match) => {
        if (/<a [^>]*>(.*?)<\/a>/i.test(match)) {
          return match.replace(/<a [^>]*>(.*?)<\/a>/gi, "$1");
        }

        return " ";
      })
      .replace(/<a [^>]*>(.*?)<\/a>/gis, "$1")
      .replace(/<quote>/gi, '"')
      .replace(/<\/quote>/gi, '"')
      .replace(/<q>/gi, '"')
      .replace(/<\/q>/gi, '"')
      .replace(/<em>|<\/em>|<strong>|<\/strong>|<b>|<\/b>|<i>|<\/i>/gi, "")
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .replace(/ +([,.;:!?])/g, "$1")
      .replace(/\( /g, "(")
      .replace(/ \)/g, ")")
      .trim(),
  );
}

function extractBody(html) {
  const start = html.search(/<h1>/i);
  const endCandidates = [
    html.search(/<div class="pub">/i),
    html.search(/<div id="footer">/i),
    html.search(/<\/article>/i),
  ].filter((value) => value > start);
  const end = endCandidates.length ? Math.min(...endCandidates) : html.length;
  return start >= 0 ? html.slice(start, end) : html;
}

function parseSectionsFromHtml(html, sectionOffset) {
  const body = extractBody(html);
  const sections = [];
  const tokenRegex = /<(h1|h2|p)(?: [^>]*)?>([\s\S]*?)<\/\1>/gi;
  let currentSection = null;
  let match;

  while ((match = tokenRegex.exec(body)) !== null) {
    const [, tag, rawInner] = match;
    const text = stripTags(rawInner);

    if (!text) {
      continue;
    }

    if (
      text.startsWith("Please help support the mission of New Advent") ||
      text === "About this page" ||
      text === "(To the Reader.)" ||
      text.includes("Translated by") ||
      text.includes("Revised and edited for New Advent") ||
      text.includes("Contact information.")
    ) {
      continue;
    }

    if (tag.toLowerCase() === "h1" || tag.toLowerCase() === "h2") {
      currentSection = {
        id: `section-${sectionOffset + sections.length + 1}`,
        title: text,
        citation: text,
        paragraphs: [],
      };
      sections.push(currentSection);
      continue;
    }

    if (!currentSection) {
      currentSection = {
        id: `section-${sectionOffset + 1}`,
        title: "Full Text",
        citation: null,
        paragraphs: [],
      };
      sections.push(currentSection);
    }

    currentSection.paragraphs.push(text);
  }

  return sections.filter((section) => section.paragraphs.length > 0);
}

function buildStats(sections) {
  return {
    sectionCount: sections.length,
    paragraphCount: sections.reduce((total, section) => total + section.paragraphs.length, 0),
  };
}

async function readSource(fileName) {
  return fs.readFile(path.join(sourceRoot, fileName), "utf8");
}

async function buildWork(workConfig) {
  const sections = [];

  for (const fileName of workConfig.fileNames) {
    const html = await readSource(fileName);
    sections.push(...parseSectionsFromHtml(html, sections.length));
  }

  return {
    slug: workConfig.slug,
    title: workConfig.title,
    source: "New Advent / public-domain patristic transcription",
    sourceUrl: `https://www.newadvent.org/fathers/${workConfig.sourceId}.htm`,
    yearLabel: workConfig.yearLabel,
    summary: workConfig.summary,
    sections,
    stats: buildStats(sections),
  };
}

async function main() {
  const library = [];

  for (const profileConfig of libraryConfig) {
    const works = [];

    for (const workConfig of profileConfig.works) {
      works.push(await buildWork(workConfig));
    }

    library.push({
      slug: profileConfig.slug,
      name: profileConfig.name,
      era: profileConfig.era,
      region: profileConfig.region,
      tradition: profileConfig.tradition,
      stream: profileConfig.stream,
      studyTracks: profileConfig.studyTracks,
      summary: profileConfig.summary,
      bio: profileConfig.bio,
      themes: profileConfig.themes,
      works,
    });
  }

  await fs.writeFile(outputPath, `${JSON.stringify(library, null, 2)}\n`, "utf8");
  console.log(`Wrote ${library.length} fathers to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
