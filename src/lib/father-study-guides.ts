import type { FatherProfile, FatherWork, StudyTradition } from "@/lib/content-types";

type TraditionLens = {
  tradition: "Catholic" | "Orthodox" | "Protestant";
  note: string;
};

type ReadingOrderItem = {
  workSlug?: string;
  title?: string;
  note: string;
};

type GuideEntry = {
  why: string;
  startWorkSlug?: string;
  startNote: string;
  readingOrder?: ReadingOrderItem[];
  keyIdeas: Array<{
    term: string;
    meaning: string;
  }>;
  traditionLens: TraditionLens[];
  scriptureConnections: string[];
  glossary: Array<{
    term: string;
    definition: string;
  }>;
};

export type FatherStudyGuide = Omit<GuideEntry, "readingOrder"> & {
  startWork?: FatherWork;
  readingOrder: Array<{
    work?: FatherWork;
    title: string;
    note: string;
  }>;
};

const defaultTraditionNotes: Record<StudyTradition, TraditionLens> = {
  catholic: {
    tradition: "Catholic",
    note: "Read for continuity of doctrine, sacramental life, episcopal order, and the Church's memory.",
  },
  orthodox: {
    tradition: "Orthodox",
    note: "Read for patristic theology, worship, ascetic formation, and the shared inheritance of the councils.",
  },
  protestant: {
    tradition: "Protestant",
    note: "Read for early biblical interpretation, apologetics, moral formation, and historical context for later debates.",
  },
};

const guideEntries: Record<string, GuideEntry> = {
  "ignatius-antioch": {
    why: "Ignatius shows what Christian worship, martyrdom, unity, bishops, and the Eucharist looked like immediately after the apostles.",
    startWorkSlug: "letter-to-the-ephesians",
    startNote: "Begin with Ephesians for his clearest picture of church unity, then read Romans for his theology of martyrdom.",
    readingOrder: [
      { workSlug: "letter-to-the-ephesians", note: "Start here for unity, obedience, and the Church gathered around Christ." },
      { workSlug: "letter-to-the-romans", note: "Read next for martyrdom as witness rather than defeat." },
      { workSlug: "letter-to-the-smyrnaeans", note: "Important for Eucharist, incarnation, and anti-docetic teaching." },
      { workSlug: "letter-to-polycarp", note: "A short pastoral letter on leadership, perseverance, and care for souls." },
    ],
    keyIdeas: [
      { term: "Eucharistic realism", meaning: "Ignatius treats the Eucharist as a central mark of real Christian communion." },
      { term: "Bishop and unity", meaning: "Unity is practical and visible, not merely private agreement." },
      { term: "Martyrdom", meaning: "The martyr is a witness whose death confesses Christ's victory." },
    ],
    traditionLens: [
      { tradition: "Catholic", note: "Especially important for early episcopacy, Eucharist, and apostolic continuity." },
      { tradition: "Orthodox", note: "Central for liturgical and episcopal understanding of the Church as communion." },
      { tradition: "Protestant", note: "Useful for seeing how early post-apostolic Christians applied Scripture in church life." },
    ],
    scriptureConnections: ["John 6", "John 17", "1 Corinthians 10-11", "Ephesians 4", "Philippians 1"],
    glossary: [
      { term: "Docetism", definition: "The claim that Christ only seemed to be human; Ignatius strongly rejects it." },
      { term: "Catholic Church", definition: "In Ignatius, the whole Church gathered in the fullness of Christ, not yet a later denominational label." },
    ],
  },
  "clement-rome": {
    why: "Clement is one of the earliest witnesses to church order, repentance, humility, and pastoral correction after the apostolic age.",
    startWorkSlug: "first-letter-to-the-corinthians",
    startNote: "Start with First Clement because it is the major text and shows how Rome exhorted Corinth toward peace.",
    readingOrder: [
      { workSlug: "first-letter-to-the-corinthians", note: "Read for order, humility, apostolic succession, and peace." },
      { workSlug: "second-letter-to-the-corinthians", note: "Read afterward as an early homiletic call to repentance and perseverance." },
    ],
    keyIdeas: [
      { term: "Apostolic order", meaning: "Ministry is received and guarded, not invented by each generation." },
      { term: "Repentance", meaning: "Restoration begins with humility, confession, and renewed obedience." },
      { term: "Peace", meaning: "Church unity is a moral duty, not a decorative ideal." },
    ],
    traditionLens: [
      { tradition: "Catholic", note: "Important for early Roman pastoral intervention and ordered ministry." },
      { tradition: "Orthodox", note: "Important for conciliar instincts, humility, and peace in the Church." },
      { tradition: "Protestant", note: "Strong example of early pastoral use of Scripture and moral exhortation." },
    ],
    scriptureConnections: ["1 Corinthians 1-3", "Romans 12", "Hebrews 13", "James 4", "1 Peter 5"],
    glossary: [
      { term: "Presbyter", definition: "An elder or ordained leader in early Christian communities." },
      { term: "Schism", definition: "A rupture of church unity, especially through rivalry, pride, or disorder." },
    ],
  },
  "polycarp-smyrna": {
    why: "Polycarp connects the apostolic generation to later martyr witness and gives a compact model of faithful pastoral Christianity.",
    startWorkSlug: "letter-to-the-philippians",
    startNote: "Begin with the letter for his pastoral theology, then read the martyrdom narrative as lived doctrine.",
    readingOrder: [
      { workSlug: "letter-to-the-philippians", note: "Pastoral instruction rooted in Scripture and apostolic memory." },
      { workSlug: "martyrdom-of-polycarp", note: "A classic account of Christian courage, worship, and witness." },
    ],
    keyIdeas: [
      { term: "Apostolic memory", meaning: "Polycarp preserves received faith through teaching and example." },
      { term: "Patient endurance", meaning: "Faithfulness is shown in ordinary obedience and final witness." },
      { term: "Martyr worship boundary", meaning: "The martyr is honored, but worship belongs to God." },
    ],
    traditionLens: [
      { tradition: "Catholic", note: "Useful for martyr devotion, apostolic continuity, and pastoral virtue." },
      { tradition: "Orthodox", note: "Useful for sanctity, liturgical memory, and the theology of witness." },
      { tradition: "Protestant", note: "Useful for early biblical exhortation, perseverance, and Christ-centered martyrdom." },
    ],
    scriptureConnections: ["Philippians 2", "2 Timothy 4", "1 Peter 4", "Revelation 2", "John 15"],
    glossary: [
      { term: "Martyr", definition: "A witness to Christ, especially one who dies rather than deny him." },
      { term: "Confession", definition: "Public loyalty to Christ under pressure, not merely private belief." },
    ],
  },
  didache: {
    why: "The Didache is a short window into early catechesis, baptism, fasting, prayer, Eucharistic discipline, and community order.",
    startWorkSlug: "didache",
    startNote: "Read it straight through once, then reread slowly as a manual of early Christian formation.",
    keyIdeas: [
      { term: "Two Ways", meaning: "Christian life is framed as the way of life versus the way of death." },
      { term: "Catechesis", meaning: "Doctrine is joined to moral training and worship practice." },
      { term: "Eucharistic discipline", meaning: "Communion belongs inside a formed and baptized community." },
    ],
    traditionLens: [
      { tradition: "Catholic", note: "Important for baptism, Eucharistic discipline, fasting, and church order." },
      { tradition: "Orthodox", note: "Important for worship, fasting rhythm, and communal moral formation." },
      { tradition: "Protestant", note: "Important for early discipleship, prayer, ethics, and church practice." },
    ],
    scriptureConnections: ["Matthew 5-7", "Matthew 6", "Matthew 28", "Acts 2", "1 Corinthians 11"],
    glossary: [
      { term: "Catechesis", definition: "Instruction that prepares believers for faithful Christian life and worship." },
      { term: "Eucharist", definition: "The Church's thanksgiving meal centered on Christ." },
    ],
  },
  barnabas: {
    why: "Barnabas is valuable for seeing early Christian typology, moral exhortation, and the struggle to read the Old Testament in Christ.",
    startWorkSlug: "epistle-of-barnabas",
    startNote: "Read with attention to how Scripture is interpreted rather than treating every argument as equally strong.",
    keyIdeas: [
      { term: "Typology", meaning: "Old Testament events and images are read as patterns fulfilled in Christ." },
      { term: "Covenant", meaning: "The letter wrestles with continuity and discontinuity between Israel and the Church." },
      { term: "Moral formation", meaning: "Doctrine leads into concrete instruction about the two ways." },
    ],
    traditionLens: [
      { tradition: "Catholic", note: "Helpful for patristic Scripture reading and early moral catechesis." },
      { tradition: "Orthodox", note: "Helpful for typological reading and ascetical moral instruction." },
      { tradition: "Protestant", note: "Helpful as a case study in early Christian Old Testament interpretation." },
    ],
    scriptureConnections: ["Genesis 17", "Leviticus 16", "Psalm 22", "Isaiah 53", "Hebrews 8-10"],
    glossary: [
      { term: "Allegory", definition: "A symbolic reading that seeks a deeper theological meaning beyond the surface text." },
      { term: "Typology", definition: "A pattern in earlier revelation that points forward to fulfillment in Christ." },
    ],
  },
  "mathetes-diognetus": {
    why: "The Letter to Diognetus is one of the most beautiful early explanations of Christian identity, mission, and the incarnation.",
    startWorkSlug: "letter-to-diognetus",
    startNote: "Read it devotionally first, then study its contrast between Christian citizenship and heavenly identity.",
    keyIdeas: [
      { term: "Christian distinctiveness", meaning: "Believers live in ordinary society while belonging finally to God." },
      { term: "Incarnation", meaning: "God saves by revealing himself and giving his Son." },
      { term: "Mission", meaning: "The Church serves the world by being faithfully different within it." },
    ],
    traditionLens: [
      { tradition: "Catholic", note: "Strong for Christian witness in society and incarnational theology." },
      { tradition: "Orthodox", note: "Strong for the mystery of divine condescension and life in the world." },
      { tradition: "Protestant", note: "Strong for apologetics, grace, and Christian vocation." },
    ],
    scriptureConnections: ["John 1", "John 17", "2 Corinthians 5", "Philippians 3", "1 Peter 2"],
    glossary: [
      { term: "Apologetic", definition: "A reasoned explanation or defense of the faith." },
      { term: "Sojourner", definition: "One who lives in a place while belonging ultimately elsewhere." },
    ],
  },
  "justin-martyr": {
    why: "Justin is essential for early apologetics, the reasonableness of faith, prophecy, worship, and Christian public witness.",
    startWorkSlug: "first-apology",
    startNote: "Start with First Apology for worship, baptism, Eucharist, prophecy, and public defense of Christians.",
    keyIdeas: [
      { term: "Logos", meaning: "Christ is the divine Word through whom truth, creation, and revelation are understood." },
      { term: "Apology", meaning: "A public defense of Christian faith against misunderstanding and accusation." },
      { term: "Prophecy", meaning: "Justin argues that Christ fulfills Israel's Scriptures." },
    ],
    traditionLens: [
      { tradition: "Catholic", note: "Important for early descriptions of baptism, Eucharist, and Sunday worship." },
      { tradition: "Orthodox", note: "Important for Logos theology, worship, and Christ's fulfillment of Scripture." },
      { tradition: "Protestant", note: "Important for apologetics, prophecy, and reasoned public theology." },
    ],
    scriptureConnections: ["John 1", "Luke 24", "Acts 17", "Isaiah 53", "1 Peter 3"],
    glossary: [
      { term: "Logos", definition: "The Word; in Christian theology, Christ as divine reason, revelation, and Son of God." },
      { term: "Apology", definition: "A defense, not an expression of regret." },
    ],
  },
  "irenaeus-lyon": {
    why: "Irenaeus is a major defender of apostolic faith, Scripture, creation, incarnation, and salvation against gnostic distortions.",
    startWorkSlug: "against-heresies",
    startNote: "Read the summaries and doctrinal sections first; his main value is the rule of faith and the unity of salvation history.",
    keyIdeas: [
      { term: "Rule of faith", meaning: "The received apostolic pattern for reading Scripture and confessing Christian doctrine." },
      { term: "Recapitulation", meaning: "Christ sums up and heals human history by becoming the new Adam." },
      { term: "Creation's goodness", meaning: "Salvation restores creation rather than escaping it." },
    ],
    traditionLens: [
      { tradition: "Catholic", note: "Foundational for apostolic succession, tradition, Scripture, and the rule of faith." },
      { tradition: "Orthodox", note: "Foundational for incarnation, deification themes, and the unity of creation and redemption." },
      { tradition: "Protestant", note: "Important for canon, heresy, biblical theology, and early anti-gnostic argument." },
    ],
    scriptureConnections: ["Genesis 1-3", "Luke 24", "Romans 5", "Ephesians 1", "Colossians 1"],
    glossary: [
      { term: "Gnosticism", definition: "A family of movements that often treated salvation as secret knowledge and matter as inferior." },
      { term: "Recapitulation", definition: "Christ re-heads and renews humanity by retracing and healing Adam's failure." },
    ],
  },
  tertullian: {
    why: "Tertullian is sharp, difficult, and important for apologetics, baptism, prayer, resurrection, and early Latin Trinitarian language.",
    startWorkSlug: "apology",
    startNote: "Begin with Apology, then move into baptism and Trinity texts after you know his polemical style.",
    readingOrder: [
      { workSlug: "apology", note: "Best entrance into his public defense of Christians." },
      { workSlug: "on-baptism", note: "Study for early sacramental practice and discipline." },
      { workSlug: "on-prayer", note: "A practical theological reading of the Lord's Prayer." },
      { workSlug: "against-praxeas", note: "Important for early Trinitarian language." },
    ],
    keyIdeas: [
      { term: "Trinitarian language", meaning: "Tertullian helps shape Latin terms for Father, Son, Spirit, and one divine substance." },
      { term: "Embodied salvation", meaning: "He defends the flesh, resurrection, and the goodness of embodied life." },
      { term: "Discipline", meaning: "His moral rigor is important, but should be read critically." },
    ],
    traditionLens: [
      { tradition: "Catholic", note: "Important but complex because his later rigorist movement must be distinguished from his theological influence." },
      { tradition: "Orthodox", note: "Useful for early anti-modalist Trinitarian argument and resurrection theology." },
      { tradition: "Protestant", note: "Useful for apologetics, doctrine, moral seriousness, and debates over tradition." },
    ],
    scriptureConnections: ["Matthew 28", "Romans 6", "1 Corinthians 15", "2 Corinthians 5", "John 14-16"],
    glossary: [
      { term: "Modalism", definition: "The idea that Father, Son, and Spirit are merely modes or masks rather than distinct persons." },
      { term: "Rigorism", definition: "A strict moral tendency that can become pastorally harsh." },
    ],
  },
  origen: {
    why: "Origen is one of the greatest early biblical theologians: brilliant, prayerful, speculative, and sometimes controversial.",
    startWorkSlug: "contra-celsum",
    startNote: "Start with Contra Celsum for apologetics, then use De Principiis carefully for his larger theological vision.",
    readingOrder: [
      { workSlug: "contra-celsum", note: "A major intellectual defense of Christianity." },
      { workSlug: "commentary-on-john", note: "Shows his biblical and spiritual exegesis." },
      { workSlug: "de-principiis", note: "Read carefully for method, doctrine, and disputed speculation." },
    ],
    keyIdeas: [
      { term: "Spiritual exegesis", meaning: "Scripture has depth that forms the soul, not only surface information." },
      { term: "Apologetics", meaning: "Origen answers philosophical and cultural objections in detail." },
      { term: "Speculation", meaning: "Some ideas are exploratory and should be weighed against later orthodox boundaries." },
    ],
    traditionLens: [
      { tradition: "Catholic", note: "Influential for Scripture, prayer, and theology, while requiring discernment on disputed teachings." },
      { tradition: "Orthodox", note: "Deeply influential for ascetical exegesis, though received with caution in later controversies." },
      { tradition: "Protestant", note: "Important for biblical interpretation, apologetics, and the history of doctrine." },
    ],
    scriptureConnections: ["John 1", "Romans 8", "1 Corinthians 2", "2 Corinthians 3", "Hebrews 5"],
    glossary: [
      { term: "Exegesis", definition: "Careful interpretation of a text." },
      { term: "Allegorical reading", definition: "A reading that seeks spiritual meaning beyond the literal sense." },
    ],
  },
  "cyprian-carthage": {
    why: "Cyprian is central for church unity, bishops, repentance after grave sin, persecution, prayer, and pastoral discipline.",
    startWorkSlug: "on-the-unity-of-the-church",
    startNote: "Begin with On the Unity of the Church, then read On the Lapsed to see pastoral discipline in crisis.",
    readingOrder: [
      { workSlug: "on-the-unity-of-the-church", note: "His most important ecclesiology text." },
      { workSlug: "on-the-lapsed", note: "A major pastoral text on repentance after persecution." },
      { workSlug: "on-the-lords-prayer", note: "Practical spiritual theology rooted in Jesus' prayer." },
      { workSlug: "on-mortality", note: "Christian hope during plague and death." },
    ],
    keyIdeas: [
      { term: "Church unity", meaning: "Unity is visible, sacramental, and pastoral." },
      { term: "The lapsed", meaning: "Christians who denied the faith under persecution and sought restoration." },
      { term: "Pastoral discipline", meaning: "Correction is ordered toward repentance and healing." },
    ],
    traditionLens: [
      { tradition: "Catholic", note: "Important for episcopacy, unity, penance, and sacramental communion." },
      { tradition: "Orthodox", note: "Important for conciliar instincts, bishops, and restoration after sin." },
      { tradition: "Protestant", note: "Important for persecution, pastoral care, repentance, and visible church debates." },
    ],
    scriptureConnections: ["Matthew 16", "Matthew 18", "John 17", "1 Corinthians 12", "2 Corinthians 2"],
    glossary: [
      { term: "The lapsed", definition: "Christians who compromised under persecution and later sought reconciliation." },
      { term: "Penance", definition: "A disciplined path of repentance and restoration." },
    ],
  },
  athanasius: {
    why: "Athanasius gives one of the clearest classic accounts of why the Son of God became man for our salvation.",
    startWorkSlug: "on-the-incarnation",
    startNote: "Read slowly with John 1 and Colossians 1 nearby; it is short but doctrinally dense.",
    keyIdeas: [
      { term: "Incarnation", meaning: "The eternal Word truly becomes human to heal and renew humanity." },
      { term: "Nicene faith", meaning: "The Son is truly God, not a creature." },
      { term: "Salvation as renewal", meaning: "Christ restores the image of God and conquers corruption and death." },
    ],
    traditionLens: [
      { tradition: "Catholic", note: "Essential for Nicene Christology and salvation through the incarnate Word." },
      { tradition: "Orthodox", note: "Essential for theosis, incarnation, and victory over death." },
      { tradition: "Protestant", note: "Essential for orthodox Christology and the gospel logic of incarnation." },
    ],
    scriptureConnections: ["John 1", "Romans 5", "1 Corinthians 15", "Colossians 1", "Hebrews 2"],
    glossary: [
      { term: "Arianism", definition: "The teaching that the Son is a created being rather than true God." },
      { term: "Theosis", definition: "Participation in God's life by grace, made possible through Christ." },
    ],
  },
  "basil-great": {
    why: "Basil is a major Cappadocian Father whose work on the Holy Spirit helped clarify Trinitarian faith and worship.",
    startWorkSlug: "on-the-holy-spirit",
    startNote: "Read for how worship reveals doctrine: the Spirit is glorified with the Father and the Son.",
    keyIdeas: [
      { term: "Doxology", meaning: "The Church's worship teaches what it believes about God." },
      { term: "Holy Spirit", meaning: "The Spirit is divine, active, and worshiped with Father and Son." },
      { term: "Cappadocian theology", meaning: "A careful language of one divine essence and three persons." },
    ],
    traditionLens: [
      { tradition: "Catholic", note: "Important for Trinitarian doctrine, liturgy, and monastic influence." },
      { tradition: "Orthodox", note: "Central to Orthodox Trinitarian theology, ascetic life, and liturgical inheritance." },
      { tradition: "Protestant", note: "Important for doctrine of the Spirit and worship-shaped theology." },
    ],
    scriptureConnections: ["Matthew 28", "John 14-16", "Acts 5", "Romans 8", "2 Corinthians 13"],
    glossary: [
      { term: "Doxology", definition: "A formula of praise that expresses doctrine through worship." },
      { term: "Hypostasis", definition: "A technical term used for person in Trinitarian theology." },
    ],
  },
  "gregory-nazianzen": {
    why: "Gregory Nazianzen is one of the finest theological voices on the Trinity and the reverent limits of speech about God.",
    startWorkSlug: "theological-orations",
    startNote: "Read slowly; these orations reward careful attention more than speed.",
    keyIdeas: [
      { term: "Theology as worship", meaning: "True speech about God requires reverence, purification, and prayer." },
      { term: "Trinity", meaning: "Father, Son, and Spirit are distinct persons sharing one divine glory." },
      { term: "Apophatic caution", meaning: "God is truly known, yet never mastered by human language." },
    ],
    traditionLens: [
      { tradition: "Catholic", note: "Major doctor of Trinitarian theology and reverent theological method." },
      { tradition: "Orthodox", note: "Called Theologian for his profound Trinitarian and contemplative theology." },
      { tradition: "Protestant", note: "Important for classical Trinitarian doctrine and theological humility." },
    ],
    scriptureConnections: ["Matthew 3", "Matthew 28", "John 1", "John 14-17", "2 Corinthians 13"],
    glossary: [
      { term: "Apophatic", definition: "A way of theology that emphasizes God's transcendence beyond human concepts." },
      { term: "Ousia", definition: "Essence or being; used to speak of the one divine nature." },
    ],
  },
  "gregory-nyssa": {
    why: "Gregory Nyssa is profound for Trinity, anthropology, resurrection, spiritual ascent, and the soul's journey into God.",
    startWorkSlug: "the-great-catechism",
    startNote: "Start with the Great Catechism for his doctrinal frame, then read Soul and Resurrection for spiritual depth.",
    readingOrder: [
      { workSlug: "the-great-catechism", note: "Best entry point into his doctrinal theology." },
      { workSlug: "on-the-making-of-man", note: "Read for image of God and human dignity." },
      { workSlug: "on-the-soul-and-the-resurrection", note: "A moving dialogue on death, hope, and resurrection." },
      { workSlug: "on-not-three-gods", note: "Important for careful Trinitarian language." },
    ],
    keyIdeas: [
      { term: "Image of God", meaning: "Human dignity and vocation are grounded in God's creative purpose." },
      { term: "Spiritual ascent", meaning: "The soul grows endlessly into deeper participation in God." },
      { term: "Resurrection hope", meaning: "Christian anthropology is ordered toward bodily resurrection." },
    ],
    traditionLens: [
      { tradition: "Catholic", note: "Important for anthropology, Trinity, resurrection, and mystical theology." },
      { tradition: "Orthodox", note: "Especially important for theosis, spiritual ascent, and Cappadocian theology." },
      { tradition: "Protestant", note: "Valuable for classical doctrine, biblical anthropology, and resurrection theology." },
    ],
    scriptureConnections: ["Genesis 1", "Exodus 3", "1 Corinthians 15", "2 Corinthians 3", "Philippians 3"],
    glossary: [
      { term: "Epektasis", definition: "The soul's continual stretching forward into God." },
      { term: "Anthropology", definition: "Theological teaching about humanity." },
    ],
  },
  "john-chrysostom": {
    why: "John Chrysostom is a master preacher and pastor, showing how Scripture becomes moral, liturgical, and pastoral formation.",
    startWorkSlug: "on-the-priesthood",
    startNote: "Begin with On the Priesthood to understand his vision of pastoral responsibility and preaching.",
    keyIdeas: [
      { term: "Preaching", meaning: "Scripture must be opened for repentance, virtue, and worship." },
      { term: "Priesthood", meaning: "Pastoral office is a grave responsibility for souls." },
      { term: "Moral formation", meaning: "The Christian life is trained through Scripture, worship, and discipline." },
    ],
    traditionLens: [
      { tradition: "Catholic", note: "Important for pastoral theology, preaching, and priestly responsibility." },
      { tradition: "Orthodox", note: "Central preacher and liturgical Father in the Orthodox tradition." },
      { tradition: "Protestant", note: "Important for expository preaching, pastoral seriousness, and moral application." },
    ],
    scriptureConnections: ["John 21", "Acts 20", "1 Timothy 3", "2 Timothy 4", "Hebrews 13"],
    glossary: [
      { term: "Chrysostom", definition: "Means golden-mouthed, referring to John's reputation as a preacher." },
      { term: "Homily", definition: "A sermon that explains and applies Scripture." },
    ],
  },
  "cyril-jerusalem": {
    why: "Cyril gives a rich picture of catechesis, creed, baptism, chrismation, Eucharist, and formation in the fourth-century Church.",
    startWorkSlug: "catechetical-lectures",
    startNote: "Read as a baptismal course: doctrine and sacrament are meant to form a new way of life.",
    keyIdeas: [
      { term: "Mystagogy", meaning: "Teaching that unfolds the meaning of the sacraments after initiation." },
      { term: "Creed", meaning: "A compact rule for confessing the apostolic faith." },
      { term: "Sacramental formation", meaning: "Baptism and Eucharist shape Christian identity and practice." },
    ],
    traditionLens: [
      { tradition: "Catholic", note: "Important for sacramental catechesis, creed, baptism, and Eucharist." },
      { tradition: "Orthodox", note: "Important for mystagogy, liturgical initiation, and catechetical formation." },
      { tradition: "Protestant", note: "Useful for early catechesis, creed, baptismal teaching, and doctrine." },
    ],
    scriptureConnections: ["Matthew 28", "John 3", "Romans 6", "1 Corinthians 10-11", "Hebrews 6"],
    glossary: [
      { term: "Mystagogy", definition: "Instruction into the mysteries of Christian worship and sacramental life." },
      { term: "Catechumen", definition: "A learner preparing for baptism and full entry into the Church." },
    ],
  },
  "augustine-hippo": {
    why: "Augustine is one of the most influential Christian thinkers on conversion, grace, desire, memory, prayer, and the restless heart.",
    startWorkSlug: "confessions",
    startNote: "Read Confessions as prayer first, autobiography second, and theology throughout.",
    keyIdeas: [
      { term: "Restless heart", meaning: "Human desire is disordered until it rests in God." },
      { term: "Grace", meaning: "God's mercy precedes, heals, and transforms the will." },
      { term: "Memory and confession", meaning: "Remembering becomes prayerful truth-telling before God." },
    ],
    traditionLens: [
      { tradition: "Catholic", note: "Foundational for grace, conversion, sacramental life, and Western theology." },
      { tradition: "Orthodox", note: "Read with discernment; valuable for prayer, repentance, and desire for God." },
      { tradition: "Protestant", note: "Major influence on Reformation debates about grace, will, sin, and salvation." },
    ],
    scriptureConnections: ["Psalm 51", "Romans 7-8", "Romans 13", "1 Corinthians 13", "Luke 15"],
    glossary: [
      { term: "Confession", definition: "Both confession of sin and confession of praise to God." },
      { term: "Concupiscence", definition: "Disordered desire that pulls the heart away from God." },
    ],
  },
  jerome: {
    why: "Jerome is essential for Scripture, translation, ascetic discipline, biblical scholarship, and the learned life of the Church.",
    startWorkSlug: "prefaces",
    startNote: "Start with the Prefaces for his scriptural concerns, then use the Letters for pastoral and ascetical texture.",
    readingOrder: [
      { workSlug: "prefaces", note: "Best entry into his work as translator and biblical scholar." },
      { workSlug: "letters", note: "Shows his pastoral counsel, friendships, conflicts, and ascetic ideals." },
      { workSlug: "de-viris-illustribus", note: "Useful for early Christian literary memory." },
      { workSlug: "perpetual-virginity-of-blessed-mary", note: "Important for later doctrinal and ascetical debates." },
    ],
    keyIdeas: [
      { term: "Scriptural scholarship", meaning: "The Church studies languages, texts, and history to hear Scripture well." },
      { term: "Asceticism", meaning: "Discipline and renunciation are ordered toward holiness." },
      { term: "Translation", meaning: "Rendering Scripture faithfully requires learning and judgment." },
    ],
    traditionLens: [
      { tradition: "Catholic", note: "Major doctor for Scripture, Vulgate tradition, ascetic life, and Marian controversy." },
      { tradition: "Orthodox", note: "Useful for Scripture, monastic ideals, and patristic literary memory." },
      { tradition: "Protestant", note: "Important for biblical languages, translation, canon discussions, and textual study." },
    ],
    scriptureConnections: ["Psalm 1", "Luke 10", "2 Timothy 3", "Hebrews 4", "1 Peter 1"],
    glossary: [
      { term: "Vulgate", definition: "The Latin Bible associated with Jerome's translation work." },
      { term: "Asceticism", definition: "Spiritual discipline involving self-denial, prayer, and ordered desire." },
    ],
  },
  ambrose: {
    why: "Ambrose joins pastoral leadership, Trinitarian doctrine, sacraments, repentance, ascetic teaching, and public courage.",
    startWorkSlug: "on-the-mysteries",
    startNote: "Begin with On the Mysteries for worship and sacraments, then read the doctrinal works on faith and Spirit.",
    readingOrder: [
      { workSlug: "on-the-mysteries", note: "A concise entrance into baptismal and Eucharistic teaching." },
      { workSlug: "on-the-christian-faith", note: "Important for Nicene doctrine." },
      { workSlug: "on-the-holy-spirit", note: "Pairs well with Basil on the divinity of the Spirit." },
      { workSlug: "on-repentance", note: "Pastoral theology of mercy and restoration." },
    ],
    keyIdeas: [
      { term: "Mysteries", meaning: "Sacramental realities that reveal and communicate grace." },
      { term: "Nicene faith", meaning: "Christ and the Spirit are confessed within the one divine life." },
      { term: "Pastoral authority", meaning: "Bishops shepherd worship, doctrine, repentance, and public morality." },
    ],
    traditionLens: [
      { tradition: "Catholic", note: "Major Western Father for sacraments, episcopal leadership, repentance, and doctrine." },
      { tradition: "Orthodox", note: "Useful for Nicene faith, sacraments, and patristic worship." },
      { tradition: "Protestant", note: "Useful for doctrine, worship history, and the pastoral background to Augustine." },
    ],
    scriptureConnections: ["John 3", "Romans 6", "1 Corinthians 10-11", "2 Corinthians 2", "Titus 3"],
    glossary: [
      { term: "Mysteries", definition: "A common patristic term for sacramental realities." },
      { term: "Catechumenate", definition: "The period of instruction before baptism." },
    ],
  },
  "leo-great": {
    why: "Leo is crucial for Christology, preaching, pastoral leadership, Roman authority, and the road to Chalcedon.",
    startWorkSlug: "sermons",
    startNote: "Begin with Sermons to hear his pastoral theology, then read Letters for doctrinal and ecclesial context.",
    readingOrder: [
      { workSlug: "sermons", note: "Best entrance into his preaching, feasts, and pastoral doctrine." },
      { workSlug: "letters", note: "Read for Christology, leadership, and the Chalcedonian context." },
    ],
    keyIdeas: [
      { term: "Two natures", meaning: "Christ is truly God and truly man in one person." },
      { term: "Chalcedon", meaning: "The council that gave classic language to Christ's full divinity and humanity." },
      { term: "Pastoral preaching", meaning: "Doctrine is delivered through feasts, sermons, and moral exhortation." },
    ],
    traditionLens: [
      { tradition: "Catholic", note: "Central for papal history, Christology, and pastoral preaching." },
      { tradition: "Orthodox", note: "Important for Chalcedonian Christology and liturgical preaching." },
      { tradition: "Protestant", note: "Important for classical Christology and doctrinal preaching." },
    ],
    scriptureConnections: ["John 1", "Philippians 2", "Colossians 1", "Hebrews 1-2", "1 John 4"],
    glossary: [
      { term: "Chalcedonian", definition: "Referring to the council's confession of Christ as one person in two natures." },
      { term: "Tome", definition: "A formal doctrinal letter, especially Leo's letter on Christology." },
    ],
  },
  "john-damascus": {
    why: "John Damascus is a great synthesizer of patristic doctrine, especially Trinity, Christology, sacraments, and the defense of icons.",
    startWorkSlug: "exposition-of-the-orthodox-faith",
    startNote: "Read as a doctrinal map: each section summarizes a larger stream of earlier patristic teaching.",
    keyIdeas: [
      { term: "Patristic synthesis", meaning: "John gathers earlier doctrine into a clear structured account." },
      { term: "Icons", meaning: "The incarnation grounds the Christian defense of holy images." },
      { term: "Orthodox faith", meaning: "Doctrine is received as worshipful confession, not private invention." },
    ],
    traditionLens: [
      { tradition: "Catholic", note: "Important for icons, doctrine, and the shared inheritance of later patristic theology." },
      { tradition: "Orthodox", note: "Major doctrinal Father for icons, liturgy, Christology, and theological synthesis." },
      { tradition: "Protestant", note: "Useful for understanding classical doctrine and the logic of icon debates." },
    ],
    scriptureConnections: ["Genesis 1", "John 1", "Colossians 1", "Hebrews 1", "1 John 1"],
    glossary: [
      { term: "Icon", definition: "A holy image used in Christian worship and devotion, grounded in the incarnation." },
      { term: "Synthesis", definition: "A careful gathering and ordering of earlier teaching." },
    ],
  },
};

function resolveWork(father: FatherProfile, slug?: string) {
  if (!slug) return undefined;
  return father.works.find((work) => work.slug === slug);
}

function titleFromTheme(theme: string) {
  return theme
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function fallbackGuide(father: FatherProfile): GuideEntry {
  const firstWork = father.works[0];

  return {
    why: `${father.name} helps readers connect doctrine, worship, Scripture, and Christian practice in the life of the early and classical Church.`,
    startWorkSlug: firstWork?.slug,
    startNote: firstWork
      ? `Start with ${firstWork.title}, then continue through the remaining works in order.`
      : "Start with the biography and themes, then return as more texts are added.",
    keyIdeas: father.themes.slice(0, 4).map((theme) => ({
      term: titleFromTheme(theme),
      meaning: `A major theme to watch while reading ${father.name}.`,
    })),
    traditionLens: father.studyTracks.map((track) => defaultTraditionNotes[track]),
    scriptureConnections: ["John 1", "Romans 8", "1 Corinthians 15", "Ephesians 4"],
    glossary: [
      { term: "Father", definition: "A major teacher whose witness shaped Christian doctrine, worship, and practice." },
      { term: "Patristic", definition: "Related to the early and classical teachers of the Church." },
    ],
  };
}

export function getFatherStudyGuide(father: FatherProfile): FatherStudyGuide {
  const entry = guideEntries[father.slug] ?? fallbackGuide(father);
  const startWork = resolveWork(father, entry.startWorkSlug) ?? father.works[0];
  const rawOrder: ReadingOrderItem[] =
    entry.readingOrder ??
    father.works.slice(0, 4).map((work, index) => ({
      workSlug: work.slug,
      note: index === 0 ? "Start here for the best entry point." : "Continue here for the next layer of the study.",
    }));

  return {
    ...entry,
    startWork,
    readingOrder: rawOrder.map((item) => {
      const work = resolveWork(father, item.workSlug);

      return {
        work,
        title: item.title ?? work?.title ?? item.workSlug ?? "Study selection",
        note: item.note,
      };
    }),
  };
}
