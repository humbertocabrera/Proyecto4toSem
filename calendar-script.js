let nav = 0; //Verifica Mes Actual
let clicked = null;
//Array que guarda mis eventos
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendario = document.getElementById('calendario');
const NuevoEvento = document.getElementById('NuevoEvento');
const deleteEvento = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const TituloEvento = document.getElementById('TituloEvento');
const semana = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


function AbrirEvento(date){
    clicked = date;
    const DiaEvento = events.find(e => e.date === clicked);

    if (DiaEvento){
        document.getElementById('eventText').innerText = DiaEvento.title;
        deleteEvento.style.display = 'block';
    }else{
        NuevoEvento.style.display = 'block';
    }
    backDrop.style.display = 'block';
}

function Calendario(){
    const FechaActual = new Date();
    
    if(nav !== 0){
        FechaActual.setMonth(new Date().getMonth() + nav);
    }
    
    const day = FechaActual.getDate();
    const month = FechaActual.getMonth();
    const year = FechaActual.getFullYear();

    const PrimerDia = new Date(year, month, 1);
    const DiasTotales = new Date(year, month + 1, 0).getDate();
    
    const StringFecha = PrimerDia.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day:'numeric',
    });
    
    const DiasAntes = semana.indexOf(StringFecha.split(', ')[0]);

    document.getElementById('CambioDeMes').innerText = `${FechaActual.toLocaleDateString('es-mx', {month:'long'})} ${year}`;

    calendario.innerHTML = "";
    
    for(let i = 1; i <= DiasAntes + DiasTotales; i++){
        const Recuadro = document.createElement('div');
        Recuadro.classList.add('day');

        const RevisaDias = `${month+1}/${i-DiasAntes}/${year}`
        
        if (i > DiasAntes){
            Recuadro.innerText = i - DiasAntes;
            const DiaEvento = events.find(e => e.date === RevisaDias);

            if((i - DiasAntes) === day && nav === 0){
                Recuadro.id = 'DiaActual';
            }
            
            if(DiaEvento){
                const EventoDiv = document.createElement('div');
                EventoDiv.classList.add('event');
                EventoDiv.innerText = DiaEvento.title;
                Recuadro.appendChild(EventoDiv);
            }

            Recuadro.addEventListener('click', ()=> AbrirEvento(RevisaDias));
        }else{
            Recuadro.classList.add('DiasMesPrev');
        }

        calendario.appendChild(Recuadro);
    }
}

function CerrarEvento(){
    TituloEvento.classList.remove('error');
    NuevoEvento.style.display = 'none';
    deleteEvento.style.display = 'none';
    backDrop.style.display = 'none';
    TituloEvento.value = "";
    clicked = null;
    Calendario();
}

function GuardarEvento(){
    if(TituloEvento.value){
        TituloEvento.classList.remove('error');
        events.push({
            date:clicked,
            title: TituloEvento.value,
        });

        localStorage.setItem('events', JSON.stringify(events));
        CerrarEvento();
    }else{
        TituloEvento.classList.add('error');
    }
}

function BorrarEvento(){
    events = events.filter (e => e.date !== clicked);
    localStorage.setItem('events', JSON.stringify(events));
    CerrarEvento();
}

function botones(){
    document.getElementById('MesSig').addEventListener('click', ()=>{
        nav++;
        Calendario();
    });

    document.getElementById('MesPrev').addEventListener('click', ()=>{
        nav--;
        Calendario();
    });

    document.getElementById('saveButton').addEventListener('click', GuardarEvento);
    document.getElementById('cancelButton').addEventListener('click', CerrarEvento);
    document.getElementById('closeButton').addEventListener('click', CerrarEvento);
    document.getElementById('deleteButton').addEventListener('click', BorrarEvento);
}


botones();
Calendario();