//cords selection
let notes           = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],
    info            = getElement('info'),
    noteSelection   = getElement('note_selection'),
    chordSelection  = getElement('chord'),
    button          = getElement('build'),
    chordInfo       = getElement('chord_info'),
    modeInfo        = document.getElementsByClassName('mode_info')[0],
    modeKeys        = document.getElementsByClassName('modeKey'),
    modeSelection   = document.getElementsByClassName('mode_selection')[0],
    minorSelection  = document.getElementsByClassName('minor_selection')[0];
    counter         = 0,
    strHighE        = getElement('strHighE'),
    strB            = getElement('strB'),
    strG            = getElement('strG'),
    strD            = getElement('strD'),
    strA            = getElement('strA'),
    strLowE         = getElement('strLowE'),
    fretNumbers     = getElement('fretNumber');
    tds             = document.getElementsByTagName('td');

function getElement(id) {
    return document.getElementById(id);
}

function stages(third, fifth, seventh) {
    //intervals set up
    var first   = notes.indexOf(noteSelection.value),
        third   = first + third <= notes.length - 1 ? first + third : first - notes.length + third,
        fifth   = first + fifth <= notes.length - 1 ? first + fifth : first - notes.length + fifth,
        seventh = first + seventh <= notes.length - 1 ? first + seventh : first - notes.length + seventh;
        
    if (arguments.length < 3) return [notes[first], notes[third], notes[fifth]];
        else return [notes[first], notes[third], notes[fifth], notes[seventh]];
}

function buildChord(third, fifth, seventh) {
    let chord;
    if (!seventh) {
        chord = stages(third, fifth);
    } else {
        chord = stages(third, fifth, seventh);
    }    
    showSelectedNotes(chord, false);
    chordInfo.children[1].innerText = '';
    for(let i = 0; i < chord.length; i++) {
        let span = document.createElement('span');
        span.innerText = chord[i];
        chordInfo.children[1].appendChild(span);
    }
    chordInfo.children[0].innerText = noteSelection.value + ' ' + chordSelection.value;    
}

button.addEventListener('click', function() {
    clearModes();
    cleartds();
    chordInfo.children[1].innerText = '';
    counter = 0;
    switch (chordSelection.value) {
        case 'major': 
            buildChord(4,7);
            break;
        case 'minor':
            buildChord(3,7)
            break;
        case 'maj6':
            buildChord(4,7,9)
            break;
        case 'min7': 
            buildChord(3,7,10)
            break;
        case '7':
            buildChord(4,7,10)
            break;
        case 'maj7':
            buildChord(4,7,11);
            break;
    }
})

function drawNotes(position, string) {
    //draws notes for each string
    let notes = notesOrder(position);
    for (let i = 0; i < 21; i++) {
        let td = document.createElement('td'),  
            span = document.createElement('span'),   
            counter = i;
        span.setAttribute('class', 'step');
        if (i > 0) {
            td.style.width = 70 - i * 3 + 'px';
        }
        if ( i == 1 || i == 3 || i == 5 || i == 7 || i == 9 || i == 12 || i == 15 || i == 17 || i == 19) {
            td.style.backgroundColor = '#283149';
        }
        if (counter >= notes.length) {
            counter = counter - notes.length;
        }       
        td.setAttribute('class', notes[counter]);
        td.innerText = notes[counter];
        td.appendChild(span);
        string.appendChild(td);
    }
}

function drawNumbers () {    
    //draw fret numbers
    for(let i = 0; i < 21; i ++) {
        let th = document.createElement('th');
        i == 0 ? th.innerText = '' : th.innerText = i;
        fretNumbers.appendChild(th);
    }
}

function notesOrder (position) {
    //organizes proper notes order for each string
    let newArray = [];
    for (let i = position; i < notes.length; i++) {
        newArray.push(notes[i]);
    }
    for (let i = 0; i < position; i++) {
        newArray.push(notes[i]);
    }
    return newArray;
}

drawNotes(4, strHighE);
drawNotes(11, strB);
drawNotes(7, strG);
drawNotes(2, strD);
drawNotes(9, strA);
drawNotes(4, strLowE);
drawNumbers();

function showSelectedNotes (arr, key) {
    cleartds();
    let notes = [],
        steps = document.getElementsByClassName('step');
    for(let i = 0; i < steps.length; i++) {
        steps[i].innerText = '';
    }
    for(let i = 0; i < arr.length; i++) {
        notes.push(document.getElementsByClassName(arr[i]));
    }
    for (let i = 0; i < notes.length; i++) {
        for (let j = 0; j < notes[i].length; j++) {
            if (key) {
                notes[i][j].classList.remove('active');                
                let step = arr.indexOf(notes[i][j].getAttribute('class')) + 1;
                notes[i][j].classList.add('active');
                notes[i][j].childNodes[1].innerText = step;
            } else {
                notes[i][j].classList.add('active');
            }
            
        }
    }
}

//modes 
function buildMajor (key) {
    let p         = notes.indexOf(key),
        chromatic = notesOrder(p),
        newKey    = [],
        modes     = document.getElementsByClassName('available_modes')[0];
        
    newKey.push(chromatic[0]);
    newKey.push(chromatic[2]);
    newKey.push(chromatic[4])
    newKey.push(chromatic[5]);
    newKey.push(chromatic[7]);
    newKey.push(chromatic[9]);
    newKey.push(chromatic[11]);
    counter++;
    
    showSelectedNotes(newKey, true);

    chordInfo.children[0].innerText = key.toUpperCase() + " " + "major";
    modes.children[0].innerText = key.toUpperCase() + " " + "major";
    for(let i = 1; i < modeSelection.children.length; i++) {
        modeSelection.children[i].children[0].innerText = newKey[i - 1];
    }
    return newKey;
}

function buildMode (key, step) {
    let originalKey = buildMajor(key),
        last        = originalKey.slice(0, step),
        first       = originalKey.slice(step, 7),
        mode        = first.concat(last);

    showSelectedNotes(mode, true);
    modeInfo.innerText = '';
    for(let i = 0; i < mode.length; i++) {        
        let span = document.createElement('span');
        span.innerText = mode[i];
        modeInfo.appendChild(span);
    }
    return mode;
}

function buildMinor (key, minorVar) {
    let p         = notes.indexOf(key),
        chromatic = notesOrder(p),
        newKey    = [];

    newKey.push(chromatic[0]);
    newKey.push(chromatic[2]);
    newKey.push(chromatic[3])
    newKey.push(chromatic[5]);
    newKey.push(chromatic[7]);
    newKey.push(chromatic[8]);
    newKey.push(chromatic[10]);
    if (!minorVar) {
        showSelectedNotes(newKey, true);   
    }    
    chordInfo.children[0].innerText = key.toUpperCase() + " " + "minor";
    return newKey;
}

function minorVariety(key, minorType) {
    let sixth     = key[5],
        seventh   = key[6],
        index7    = notes.indexOf(seventh),
        index6    = notes.indexOf(sixth),
        new7index = index7 + 1 <= 11 ? index7 + 1 : 0,
        new6index = index6 + 1 <= 11 ? index6 + 1 : 0,
        newKey    = key,
        td        = document.getElementsByTagName('td');
    
    newKey[6] = notes[new7index];
    if(minorType === 'melodic') {
        newKey[5] = notes[new6index];
    }
    modeInfo.innerText = '';
    for (let i = 0; i < td.length; i++) {
        td[i].classList.remove('active');
    }
    for(let i = 0; i < newKey.length; i++) {        
        let span = document.createElement('span');
        span.innerText = newKey[i];
        modeInfo.appendChild(span);
    }
    showSelectedNotes(newKey, true);
    return newKey;
}

function drawMode (mode, step, keyNotes) {
    cleartds();
    let key;
    for (let i = 0; i < tds.length; i++) {
        tds[i].classList.remove('active');
    }
    key = mode(noteSelection.value, step);
    
    if (keyNotes) {
        chordInfo.children[1].innerText = '';
        for(let i = 0; i < key.length; i++) {
            let span = document.createElement('span');
            span.innerText = i + 1 + '. ' + key[i];
            chordInfo.children[1].appendChild(span);
        }
    }
    
}

// major mode/minor variation highlight
for (let i = 1; i < modeSelection.children.length; i++) {
    modeSelection.children[i].addEventListener('click', function (e) {
        for (let i = 1; i < modeSelection.children.length; i++) {
            modeSelection.children[i].classList.remove('active');
        }
        this.classList.add('active');
    })
}
for (let i = 0; i < minorSelection.children.length; i++) {
    minorSelection.children[i].addEventListener('click', function (event) {
        for (let i = 0; i < minorSelection.children.length; i++) {
            minorSelection.children[i].classList.remove('active');
        }
        this.classList.add('active');
    })
}

//selected notes highlight
for (let i = 0; i < tds.length; i++) {    
    tds[i].addEventListener('click', function(e) {
        if (this.classList.contains('selected')) {
            cleartds();
        } else {
            let cls = this.classList[0];
        for (let i = 0; i < tds.length; i++) {
            tds[i].classList.remove('selected');
        }
        for (let i = 0; i < tds.length; i++) {
            if (tds[i].classList.contains(cls)) {
                tds[i].classList.add('selected');
            }
        }
        this.classList.add('selected');
        }
        
    })
}

function cleartds () {
    for (let i = 0; i < tds.length; i++) {
        tds[i].classList.remove('selected');
    }
}
function clearModes () {
    modeSelection.style.display = 'none';
    minorSelection.style.display = 'none';
    modeInfo.innerText = '';
    for(let i = 1; i < modeSelection.children.length; i++) {
        modeSelection.children[i].classList.remove('active');
    }
    for(let i = 0; i < minorSelection.children.length; i++) {
        minorSelection.children[i].classList.remove('active');
    }
}

document.body.addEventListener('click', function(e) {   
    switch(e.target.id) {
        case 'ionian':
            drawMode(buildMode, 0);
            break;
        case 'dorian':
            drawMode(buildMode, 1);
            break;
        case 'phrygian':
            drawMode(buildMode, 2);
            break;
        case 'lydian':
            drawMode(buildMode, 3);
            break;
        case 'mixolydian':
            drawMode(buildMode, 4);
            break;
        case 'aeolian':
            drawMode(buildMode, 5);
            break;
        case 'locrian':
            drawMode(buildMode, 6);
            break;
        case 'majorKey':
            clearModes();
            drawMode(buildMajor, 0, true);
            document.getElementById('ionian').classList.add('active');
            drawMode(buildMode, 0);
            modeSelection.style.display = 'block';
            counter = 0;
            break;
        case 'minorKey':
            clearModes();
            drawMode(buildMinor, 0, true);
            minorSelection.style.display = 'block';
            counter = 0;
            break;
        case 'harmonicMinor':
            let temp = buildMinor(noteSelection.value, true);
            minorVariety(temp);
            break;
        case 'melodicMinor':
            let temp2 = buildMinor(noteSelection.value, true);
            minorVariety(temp2, 'melodic');
            break;
    }   
})
