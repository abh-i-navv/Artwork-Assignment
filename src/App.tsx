import { useEffect, useRef, useState } from 'react'
import './App.css'
import {fetchArtworks} from '../utils/api'
import type { Artwork } from '../types/artwork';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Paginator, type PaginatorPageChangeEvent } from 'primereact/paginator';
import { LuLoader } from "react-icons/lu";
import { OverlayPanel } from 'primereact/overlaypanel';
import { PiCaretDownBold } from "react-icons/pi"; 


function App() {

    const [page,setPage] = useState<number> (1)
    const [artworks, setArtworks] = useState<Artwork[]>([]); 
    const [selectedProducts, setSelectedProducts] = useState<Artwork[] | null>(null);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(12);
    const [totalPages,setTotalPages] = useState<number>(0);
    const [rowSelection, setRowSelection] = useState<number>(0);

    const op = useRef<OverlayPanel | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        // loading artworks data from the API
        fetchArtworks(page).then((data) => {
          setArtworks(data.data);
          setTotalPages(data.pagination.total_pages);
          setFirst(data.pagination.offset);
          setRows(data.pagination.limit);
          setLoading(false);
        });

    },[page]);

    useEffect(() => {
      if(rowSelection < 1){
        return;
      }
      // it is used to select artworks based on the rowSelection value
      // if rowSelection is greater than 12, it will fetch multiple pages
      // if rowSelection is less than or equal to 12, it will fetch artworks from the current state variable
      if(rowSelection > 12) {
          let pageSelected = Math.ceil(rowSelection / rows);
          let currSelection = rowSelection
          for(let i = 1; i<= pageSelected; i++) {
            if(currSelection > 12) {
                fetchArtworks(i).then((apiData) => {
                  setSelectedProducts((prev) => {
                  if (prev) {
                    return [...prev, ...apiData.data];
                  }
                  return apiData.data;
                })
                })

              currSelection -= 12;

            } else {

              fetchArtworks(i).then((apiData) => {
                setSelectedProducts((prev) => {
                  if (prev) {
                    return [...prev, ...apiData.data.slice(0, currSelection)];
                  }
                  return apiData.data.slice(0, currSelection);
                });
              })
              break;
            }
          }
          setRowSelection(0);
        }
        else if(rowSelection <= 12){
          setSelectedProducts((prev) => {
            if(prev){
              return [...prev, ...artworks.slice(0,rowSelection)]
            }
            else{
              return artworks.slice(0,rowSelection);
            }
          })
          setRowSelection(0);
        }
    }, [rowSelection]);

    // it is used to handle the page change (pagination)
    const onPageChange = (event: PaginatorPageChangeEvent) => {
      console.log(event)
        setPage(event.page + 1);
        setFirst(event.first);
        setRows(event.rows);
    };

    // it is used to handle the manual selection of rows from the input field
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (op.current) {
            op.current.hide();
        }
        const value = inputRef.current?.value;
        if (value) {
          setRowSelection(Number(value));
          console.log(rowSelection)
        }
      }

     return (
    isLoading ? <LuLoader /> :
    (<div className="card">
      <DataTable value={artworks} selection={selectedProducts} onSelectionChange={e => {setSelectedProducts(e.value as any)}} dataKey="id" tableStyle={{ minWidth: '50rem' }}>
        <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />
        
        <Column field="title" header={
          <div className='flex items-center gap-2'>
            <PiCaretDownBold
              className='cursor-pointer'
              onClick={(e) => {
                op.current?.toggle(e);
                setTimeout(() => inputRef.current?.focus(), 0);
              }}
            />
             <OverlayPanel ref={op} >
              <div className="m-2 p-2 flex">
                <input className="border px-2 py-1 mb-2 block w-full" ref= {inputRef} placeholder="Enter value" onSubmit={(e) => op.current?.toggle(e)} 
                            onKeyDown={(e) => {
                              if(e.key === "Enter"){
                                op.current?.toggle(e)
                                onSubmit(e)}
                              }
                }/>
                <button 
                    onClick={(e) => {
                      op.current?.toggle(e)
                      onSubmit(e);
                    }}
                  >Submit</button>
              </div>
            </OverlayPanel>
            Title
          </div>
        } />

        <Column field="place_of_origin" header="Place of Origin" />
        <Column field="artist_display" header="Artist Display" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Date" />
        <Column field="date_end" header="End Date" />
      </DataTable>
       <Paginator first={first} rows={rows} totalRecords={totalPages} onPageChange={onPageChange}/>
    </div>)
  )
}

export default App
