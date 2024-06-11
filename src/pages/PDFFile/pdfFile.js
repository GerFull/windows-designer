import ReactPDF, { PDFViewer, Document, Page, StyleSheet, Text, image, Image, View, Font } from '@react-pdf/renderer'
import { Stage, Layer, Group, Rect } from "react-konva";
import React, { useEffect, useState } from 'react'


function PdfFile(props) {

   Font.register({
      family: "RobotoLight",
      src:
         "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf"
   });
   Font.register({
      family: "RobotoRegular",
      src:
         "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf"
   });
   Font.register({
      family: "RobotoMedium",
      src:
         "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf"
   });


   const styles = StyleSheet.create({
      body: {
         display: 'flex',
         flexDirection: 'column',
         justifyContent: 'space-between',
         // border: '1px solid black',
         padding: 10
      },
      textContainer: {
         padding: 10,
         display: 'flex',
         flexDirection: 'column',
         gap: 15
      },
      title: {
         fontFamily: "RobotoMedium",
         fontSize: 11,
      },
      costTitle: {
         fontFamily: "RobotoMedium",
         fontSize: 11,
         color: 'red'
      },
      subtitle: {
         fontFamily: "RobotoRegular",
         fontSize: 11,
      },
      image: {
         width: 400,
         // height: 300
      },
      imageInside: {
         // width: 800,
         height: 450,
      },
      container: {
         display: 'flex',
         width: 400,
         height: 500,
         // border: '1px solid black',
         flexDirection: 'row',
         justifyContent: 'center',
         alignItems: 'center'
      },
      containerInside: {
         display: 'flex',
         width: '100%',
         height: 545,
         // border:'1px solid black',
         flexDirection: 'row',
         justifyContent: 'center',
         alignItems: 'center'
      },
      containerMain: {
         display: 'flex',
         width: '100%',
         height: "100%",
         flexDirection: 'row',
         gap: 15
      },
      footerTextBox: {
         display: 'flex',
         width: '100%',
         flexDirection: 'row',
         justifyContent: 'center'
      },
      titleFooter: {
         fontFamily: "RobotoRegular",
         fontSize: 9,
      },
      subtitleFooter: {
         fontFamily: "RobotoRegular",
         fontSize: 8,
      },
      footerInside: {
         padding: 10
      },
      textTitleBox: {
         display: 'flex',
         flexDirection: 'row',
         gap: 10
      },
      textBox: {
         display: 'flex',
         flexDirection: 'row',
         gap: 5
      },
      textBoxFooter: {
         display: 'flex',
         flexDirection: 'row',
         gap: 5,
         justifyContent: 'flex-end'
      },
      textAddBox: {
         display: 'flex',
         flexDirection: 'row',
         gap: 10
      },
      infoContainer: {
         display: 'flex',
         width: 450,
         flexDirection: 'column',
         justifyContent: 'space-between'

      },
      infoFooter: {
         display: 'flex',
         flexDirection: 'row',
         justifyContent: 'flex-end'

      }

   })



   return (

      <Document >
         <Page orientation='landscape' style={styles.body}>
            <View style={styles.body}>
               <View style={styles.containerMain}>
                  <View style={styles.container}>

                     {props.image && <Image style={styles.image} src={props.image} />}

                  </View>

                  <View style={styles.infoContainer}>
                     <View style={styles.textContainer}>

                        <View style={styles.textTitleBox}>
                           <Text style={styles.title}>
                              ШКАФ КУПЕ
                           </Text>
                           <Text style={styles.subtitle}>
                              Размеры:   {props.InfoProduct.size}
                           </Text>

                        </View>

                        <View>

                           <View style={styles.textBox}>
                              <Text style={styles.subtitle}>
                                 Толщина материалов:
                              </Text>
                              <Text style={styles.title}>16</Text>
                           </View>

                           <View style={styles.textBox}>
                              <Text style={styles.subtitle}>
                                 Цвет
                              </Text>
                              <Text style={styles.title}>{props.InfoProduct.material}</Text>
                           </View>

                           <View style={styles.textBox}>
                              <Text style={styles.subtitle}>
                                 Толщина кромки:
                              </Text>
                              <Text style={styles.title}>1</Text>
                           </View>

                           <View style={styles.textBox}>
                              <Text style={styles.subtitle}>
                                 Цвет:
                              </Text>
                              <Text style={styles.title}>{props.InfoProduct.material}</Text>
                           </View>

                        </View>

                        <View>
                           <Text style={styles.subtitle}>
                              Система: {props.InfoProduct.system ? 'Style' : 'Slim'}
                           </Text>

                           <Text style={styles.subtitle}>
                              Профиль: {props.InfoProduct.colorFrame}
                           </Text>
                        </View>


                        <View>
                           <View style={styles.textBox}>
                              <Text style={styles.subtitle}>
                                 Название системы:
                              </Text>
                              <Text style={styles.title}></Text>
                           </View>

                           <View style={styles.textBox}>
                              <Text style={styles.subtitle}>
                                 Двери:
                              </Text>
                              <Text style={styles.title}>{props.InfoProduct.doors}</Text>
                           </View>

                           <View style={styles.textBox}>
                              <Text style={styles.subtitle}>
                                 Задняя стенка: {props.InfoProduct.mainVisible ? 'Есть' : 'Нету'}
                              </Text>
                              <Text style={styles.title}></Text>
                           </View>


                        </View>

                        <View>
                           <Text style={styles.title}>
                              Дополнительная комплектация
                           </Text>

                           <View style={styles.textAddBox}>
                              <Text style={styles.title}>
                                 Штанги: {props.InfoProduct.countBarbel }
                              </Text>

                              <Text style={styles.title}>
                                 Ящики: {props.InfoProduct.countBox }
                              </Text>
                           </View>
                           <View style={styles.textAddBox}>
                              <Text style={styles.title}>
                                 Вешалка: {props.InfoProduct.countHanger }
                              </Text>

                       
                           </View>

                        </View>

                     </View>

                     <View style={styles.infoFooter}>

                        <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }} >
                           <View style={styles.textBoxFooter}>
                              <Text style={styles.title}>
                                 Дата обсчёта:
                              </Text>
                              <Text style={styles.title}>{props.InfoProduct.date}</Text>
                           </View>
                           <View style={styles.textBoxFooter}>
                              <Text style={styles.title}>
                                 Кол-во изделий, шт :
                              </Text>
                              <Text style={styles.title}>1</Text>
                           </View>
                           <View style={styles.textBoxFooter}>
                              <Text color='red' style={styles.costTitle}>
                                 Цена изделия, руб:
                              </Text>
                              <Text style={styles.costTitle}>{props.InfoProduct.cost}</Text>
                           </View>
                        </View>
                     </View>

                  </View>



               </View>

               <View >

                  <Text style={styles.titleFooter}>С ЭСКИЗОМ И РАЗМЕРАМИ ОЗНАКОМЛЕН И СОГЛАСЕН  _________________________________</Text>


                  <View style={styles.footerTextBox}>
                     <Text style={styles.subtitleFooter}>фамилия, подпись Заказчика, М.П.</Text>

                  </View>

               </View>

            </View>


         </Page>
         <Page orientation='landscape'>
            <View style={styles.containerInside}>

               {props.imageInside && <Image style={styles.imageInside} src={props.imageInside} />}

            </View>
            <View style={styles.footerInside}>

               <Text style={styles.titleFooter}>С ЭСКИЗОМ И РАЗМЕРАМИ ОЗНАКОМЛЕН И СОГЛАСЕН  _________________________________</Text>


               <View style={styles.footerTextBox}>
                  <Text style={styles.subtitleFooter}>фамилия, подпись Заказчика, М.П.</Text>

               </View>

            </View>
         </Page>
      </Document>






   )
}

export default PdfFile


